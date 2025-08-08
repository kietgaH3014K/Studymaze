# views.py
from openai import OpenAI
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import ProgressLog
from .serializers import ProgressLogSerializer
from django.contrib.auth.models import User
import re

openai = OpenAI(
    api_key="rt4TcoQRkgGx6YAlEPArqiVKJd1lPAxx",  # ⚠️ nên chuyển sang biến môi trường
    base_url="https://api.deepinfra.com/v1/openai"
)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_learning_path(request):
    # Debug xem body có vào không
    # print(">>>> REQUEST DATA:", request.data)

    data = request.data
    class_level = data.get('class_level')
    subject = data.get('subject')
    study_time = data.get('study_time')
    goal = data.get('goal')

    if not all([class_level, subject, study_time, goal]):
        return Response({'error': 'Thiếu thông tin bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

    messages = [
        {
            "role": "system",
            "content": "Bạn là chuyên gia lập kế hoạch tự học. Trả lời HOÀN TOÀN bằng tiếng Việt."
        },
        {
            "role": "user",
            "content": f"""
Hãy lập kế hoạch tự học 4 tuần cho học sinh lớp {class_level} muốn cải thiện môn {subject}.
Học sinh học {study_time} mỗi ngày. Mục tiêu: {goal}.

Trả lời theo đúng format sau:
Tuần 1:
Ngày 1: [Nội dung học] | Link tài liệu: [link]
...
Ngày 7: ...

Tuần 2:
Ngày 8: ...
...
Ngày 14: ...

Tuần 3:
Ngày 15: ...
...
Ngày 21: ...

Tuần 4:
Ngày 22: ...
...
Ngày 28: ...

Chú ý: Mỗi dòng là 1 ngày học, có mô tả bài học và link web hữu ích miễn phí cho học sinh. 
Không thêm lời mở đầu hay kết luận. Trả đúng format trên.
"""
        }
    ]

    try:
        response = openai.chat.completions.create(
            model="openchat/openchat_3.5",
            messages=messages,
            stream=False
        )
    except Exception as e:
        return Response({'error': 'Lỗi GPT', 'details': str(e)}, status=500)

    gpt_text_vi = response.choices[0].message.content.strip()

    # Parse từng dòng Ngày N:
    plan = {}
    for line in gpt_text_vi.split('\n'):
        match = re.match(r"Ngày\s+(\d+):\s*(.+)", line.strip())
        if match:
            day_number = int(match.group(1))
            task_full = match.group(2).strip()
            plan[day_number] = task_full

    if not plan:
        return Response({'error': 'Không thể phân tích nội dung từ GPT.'}, status=500)

    user, _ = User.objects.get_or_create(username='default_user')

    # xóa lịch cũ cùng môn học để tránh chồng lặp
    ProgressLog.objects.filter(user=user, subject=subject).delete()

    for day_number, task in plan.items():
        week = (day_number - 1) // 7 + 1
        ProgressLog.objects.create(
            user=user,
            subject=subject,
            week=week,
            day_number=day_number,
            task_title=task,
            status='not_done'
        )

    return Response({
        "message": "✅ Đã tạo lộ trình học!",
        "subject": subject,
        "plan": plan,
        "raw_gpt_output": gpt_text_vi
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_progress_list(request):
    subject = request.query_params.get('subject')
    logs = ProgressLog.objects.all().order_by('week', 'day_number')
    if subject:
        logs = logs.filter(subject=subject)
    serializer = ProgressLogSerializer(logs, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # nếu không yêu cầu đăng nhập
def update_progress_status(request):
    log_id = request.data.get('id')
    new_status = request.data.get('status')

    if not log_id or not new_status:
        return Response({"error": "Thiếu thông tin 'id' hoặc 'status'"}, status=400)

    try:
        log = ProgressLog.objects.get(id=log_id)
        log.status = new_status
        log.save()
        return Response({"message": "Cập nhật trạng thái thành công!"})
    except ProgressLog.DoesNotExist:
        return Response({"error": "Không tìm thấy bản ghi"}, status=404)
