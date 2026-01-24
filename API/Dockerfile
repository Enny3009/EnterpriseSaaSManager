# 1. Build Stage - Updated to .NET 10.0
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all project files first (for better caching)
COPY ["API/API.csproj", "API/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]

# Restore dependencies
RUN dotnet restore "API/API.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/API"
RUN dotnet publish "API.csproj" -c Release -o /app/publish

# 2. Runtime Stage - Updated to .NET 10.0
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]