# 1️⃣ Use official OpenJDK 17 image
FROM openjdk:17-jdk-slim

# 2️⃣ Set working directory inside container
WORKDIR /app

# 3️⃣ Copy Maven wrapper and pom.xml first (caching layer)
COPY mvnw pom.xml ./
COPY .mvn .mvn

# 4️⃣ Copy backend source code
COPY src src

# 5️⃣ Build the Spring Boot project
RUN ./mvnw clean package -DskipTests

# 6️⃣ Expose port (Render assigns PORT)
EXPOSE 8080

# 7️⃣ Run the JAR file
CMD ["java", "-jar", "target/Drive-BE-0.0.1-SNAPSHOT.jar"]
