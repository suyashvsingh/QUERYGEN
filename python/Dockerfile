FROM python:3.12
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc g++
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
