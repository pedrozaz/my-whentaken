FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
ENV VITE_API_URL=""
RUN npm run build



FROM maven:3.9.6-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/src ./src

COPY --from=frontend-build /app/frontend/dist /app/static-frontend

RUN mvn clean package -DskipTests



FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar
COPY --from=backend-build /app/backend/src/main/resources/rounds_data.json ./rounds_data.json

EXPOSE 8080

USER 1000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
