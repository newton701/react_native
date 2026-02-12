## TodoAppExpo – Java & PostgreSQL (Optional Backend)

This app is a React Native / Expo frontend.  
You can **optionally** connect it to a **Java backend** with a **PostgreSQL database**.

### 1. Big picture

- **Frontend (this app)**: Shows screens, forms, todo list, etc.
- **Backend (Java)**: Exposes HTTP APIs like `GET /todos`, `POST /todos`.
- **Database (PostgreSQL)**: Stores the real data in tables.

Data flow:

- App calls a URL → Java receives request → talks to PostgreSQL → sends JSON back → app shows it.

---

### 2. What you need installed

- **Java 17+**
- **Maven** or **Gradle** (build tool)
- **PostgreSQL** (with a database and user created)
- This Expo project (already here)

---

### 3. Create a simple Java backend (Spring Boot)

1. Go to [`https://start.spring.io`](https://start.spring.io)  
2. Choose:
   - **Project**: Maven (or Gradle, your choice)
   - **Language**: Java  
   - **Spring Boot**: stable version  
   - **Dependencies**:  
     - Spring Web  
     - Spring Data JPA  
     - PostgreSQL Driver  
3. Download the project, unzip, and open it in your IDE (IntelliJ / VS Code / Eclipse).

---

### 4. Connect Java to PostgreSQL

In your Spring Boot project, open `src/main/resources/application.properties` (or `application.yml`) and add something like:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todo_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- `todo_db` = name of your PostgreSQL database.  
- `your_db_user` / `your_db_password` = the PostgreSQL user and password you created.

Create entities and APIs, for example:

- A `Todo` entity (id, title, completed, etc.).
- A `TodoRepository` (Spring Data JPA interface).
- A `TodoController` with endpoints like:
  - `GET /todos` → list all todos
  - `POST /todos` → create a todo

Run the backend:

```bash
mvn spring-boot:run
# or
./mvnw spring-boot:run
```

By default it will start at `http://localhost:8080`.

---

### 5. Call the Java API from the Expo app

In your React Native code, you call the backend with `fetch` (or `axios`).

Example (inside some screen or service file):

```ts
const API_URL = "http://localhost:8080"; // for web. For a device, use your computer's IP.

export async function getTodos() {
  const res = await fetch(`${API_URL}/todos`);
  return await res.json();
}

export async function createTodo(title: string) {
  await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}
```

Then use these functions in your components to load and save todos.

---

### 6. Connecting from phone vs web

- **When running Expo on web**:  
  - `API_URL = "http://localhost:8080"` usually works.
- **When testing on a real phone**:
  - Phone and laptop must be on **same Wi‑Fi**.
  - Use your **computer’s local IP**, for example:  
    - `API_URL = "http://192.168.1.10:8080"`

---

### 7. Quick checklist

1. PostgreSQL is running and database/user created.  
2. Java Spring Boot app runs and `http://localhost:8080/todos` works in browser or Postman.  
3. Expo app uses the correct `API_URL` and calls the Java endpoints.  

If all three are true, your Expo app is connected to Java + PostgreSQL. 🙂

