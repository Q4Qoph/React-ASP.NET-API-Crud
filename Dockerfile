FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY ./EmployeeAPI/*.csproj ./
RUN dotnet restore

# Copy the rest of the files and build
COPY ./EmployeeAPI/ ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Create directory for SQLite database
RUN mkdir -p /app/data
ENV DefaultConnection="Data Source=/app/data/employee.db"

ENTRYPOINT ["dotnet", "EmployeeAPI.dll"]