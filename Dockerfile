FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar
COPY --from=backend-build /app/backend/src/main/resources/rounds_data.json ./rounds_data.json

EXPOSE 8080

USER 1000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
