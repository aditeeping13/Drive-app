# Use official OpenJDK 21 image
# ---------- Build Stage ----------
FROM openjdk:21-jdk-slim as builder

WORKDIR /app

# Copy Maven wrapper and pom.xml for dependency caching
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime Stage ----------
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy only the final jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Run as non-root user (better security)
RUN addgroup --system spring && adduser --system --ingroup spring spring && \
    chown -R spring:spring /app
USER spring

# Expose Render's port
EXPOSE 8080

# JVM optimizations (Render sets RAM/CPU automatically)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Start the app
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
