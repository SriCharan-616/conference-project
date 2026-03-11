from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Paper

@api_view(['POST'])
def upload_paper(request):
    title = request.data.get('title')
    author = request.data.get('author')
    conference = request.data.get('conference')
    file = request.FILES.get('file')

    if not all([title, author, conference, file]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    paper = Paper.objects.create(
        title=title,
        author=author,
        conference=conference,
        file=file
    )

    return Response({'message': 'Paper uploaded successfully', 'id': paper.id}, status=status.HTTP_201_CREATED)
