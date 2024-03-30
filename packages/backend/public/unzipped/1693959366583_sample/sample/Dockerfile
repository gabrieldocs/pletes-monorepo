# Stage 1: Build the application
FROM maven:3.8.4-openjdk-11-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project's pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the entire project source code
COPY src ./src

# Build the Java application
RUN mvn package

# Stage 2: Run Pitest and generate a detailed report
FROM build AS pitest

# Set the working directory inside the container
WORKDIR /app

# Run Pitest and generate an XML report
RUN mvn org.pitest:pitest-maven:mutationCoverage \
    -DoutputFormats=XML \
    -DoutputDirectory=target/pit-reports

# Stage 3: Run Maven tests and capture the output
FROM build AS test

# Set the working directory inside the container
WORKDIR /app

# Run Maven tests and capture the output to a file
RUN mvn test 2>&1 | tee /app/test-output.txt

# Stage 4: Create the final runtime image
FROM adoptopenjdk:11-jre-hotspot

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the build stage to the runtime image
COPY --from=build /app/target/blank-maven-project-1.0-SNAPSHOT.jar ./app.jar

# Copy the Pitest XML report from the Pitest stage to the runtime image
COPY --from=pitest /app/target/pit-reports ./pit-reports

# Copy the test output file from the test stage to the runtime image
COPY --from=test /app/test-output.txt ./test-output.txt

# Define the command to run your Java application
CMD ["java", "-jar", "app.jar"]
