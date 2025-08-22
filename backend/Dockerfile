FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml first for better layer caching
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Copy frontend build to static resources
COPY frontend/build src/main/resources/static

# Build the application
RUN ./mvnw clean package -DskipTests

# Use multi-stage build for smaller final image (optional)
# FROM openjdk:21-jre-slim
# WORKDIR /app
# COPY --from=0 /app/target/*.jar app.jar

EXPOSE 8080

# More flexible JAR execution
CMD ["sh", "-c", "java -jar target/*.jar"]