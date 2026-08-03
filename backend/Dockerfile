FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock* .

RUN pip install uv
RUN uv sync --frozen --no-dev

COPY . .

RUN ls -la /app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]