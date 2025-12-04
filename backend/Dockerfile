FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app

COPY ./backend ./backend

RUN ./backend/mvnw -f ./backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar
COPY --from=backend-build /app/backend/src/main/resources/rounds_data.json ./rounds_data.json

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
