# 🏛️ Government Service Portal

A comprehensive digital platform for citizens to access and apply for various government services online. This full-stack application provides a seamless experience for submitting applications, managing profiles, and tracking service requests.

## ✨ Features

### 👤 Citizen Services
- **User Registration & Authentication**: Secure JWT-based authentication system
- **Citizen Profile Management**: Complete profile creation with personal details
- **Service Applications**: Apply for various government services (Birth Certificate, Death Certificate, Marriage Certificate, etc.)
- **Application Tracking**: Real-time status updates and application history
- **Document Upload**: Secure file upload for supporting documents
- **PDF Generation**: Download application forms as professional PDF documents

### 🔐 Admin Panel
- **Application Management**: Review, approve, and reject applications
- **User Management**: Oversee citizen accounts and profiles
- **Service Oversight**: Monitor service requests and statistics
- **Feedback Management**: Handle citizen feedback and complaints
- **Payment Processing**: Manage payment statuses and transactions

### 💳 Payment Integration
- **Payment Status Tracking**: Monitor application payment statuses
- **Secure Transactions**: Integrated payment processing system

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Application counts, service popularity, user metrics
- **Status Overview**: Pending, approved, rejected application summaries
- **Service Analytics**: Track usage of different government services

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Database**: MySQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT Authentication
- **Build Tool**: Maven
- **Validation**: Bean Validation (JSR-303)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **State Management**: React Hooks

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java**: JDK 17 or higher
- **Node.js**: Version 16 or higher
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher
- **Git**: For version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/starboy1402/DigiGov.git
cd gov-portal-project
```

### 2. Backend Setup

#### Database Configuration
1. Install and start MySQL server
2. Create a database named `gov_portal_db`:
```sql
CREATE DATABASE gov_portal_db;
```
3. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gov_portal_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Build and Run Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

#### Backend (application.properties)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gov_portal_db
spring.datasource.username=root
spring.datasource.password=12345

# JWT Configuration
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

#### Frontend
The frontend uses environment variables for API endpoints. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/admin/login` - Admin login

### Citizen Endpoints
- `GET /api/profile` - Get citizen profile
- `PUT /api/profile` - Update citizen profile
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Submit new application

### Admin Endpoints
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/{id}/approve` - Approve application
- `PUT /api/admin/applications/{id}/reject` - Reject application
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Services
- Birth Certificate Application
- Death Certificate Application
- Marriage Certificate Application
- Land Registration
- Business License
- And more...

## 🗂️ Project Structure

```
gov-portal-project/
├── backend/
│   ├── src/main/java/com/govportal/backend/
│   │   ├── controller/     # REST controllers
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # Security configuration
│   │   ├── dto/           # Data transfer objects
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional design with government branding
- **Intuitive Navigation**: Easy-to-use navigation with clear call-to-actions
- **Real-time Updates**: Live status updates and notifications
- **Accessibility**: WCAG compliant design principles

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Secure password storage
- **Role-based Access**: Different permissions for citizens and admins
- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📱 Usage

### For Citizens
1. **Register**: Create an account with your NID and personal details
2. **Complete Profile**: Fill in your complete citizen profile
3. **Apply for Services**: Choose from available government services
4. **Upload Documents**: Attach required supporting documents
5. **Make Payment**: Complete payment for applicable services
6. **Track Progress**: Monitor application status in real-time
7. **Download PDFs**: Get official PDF copies of your applications

### For Administrators
1. **Login**: Access admin panel with admin credentials
2. **Review Applications**: Examine submitted applications
3. **Approve/Reject**: Process applications with comments
4. **Manage Users**: Oversee citizen accounts
5. **View Analytics**: Monitor system statistics and reports

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
```bash
cd backend
./mvnw clean package
```
2. Deploy the JAR to your server
3. Configure production database settings

### Frontend Deployment
1. Build the production bundle:
```bash
cd frontend
npm run build
```
2. Deploy the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Java naming conventions for backend code
- Use functional components and hooks in React
- Maintain consistent code formatting
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- React for the dynamic frontend library
- MySQL for reliable database management
- Tailwind CSS for beautiful styling
- All contributors and the open-source community

---

**Made with ❤️ for digital government transformation**