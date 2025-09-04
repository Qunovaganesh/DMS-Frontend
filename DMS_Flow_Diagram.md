# DMS (Document Management System) - Flow Diagram

## System Architecture & User Flow

```mermaid
graph TB
    %% User Entry Point
    Start([User Access]) --> Auth{Authentication}
    
    %% Authentication Flow
    Auth -->|Invalid| Login[Login Form]
    Auth -->|Valid| RoleCheck{Check User Role}
    Login --> Auth
    
    %% Role-based Routing
    RoleCheck -->|Admin| AdminFlow[Admin Dashboard]
    RoleCheck -->|Manufacturer| MfrFlow[Manufacturer Dashboard]
    RoleCheck -->|Distributor| DistFlow[Distributor Dashboard]
    
    %% Admin Flow
    AdminFlow --> AdminFeatures[Admin Features]
    AdminFeatures --> Masters[Master Data Management]
    AdminFeatures --> MailCenter[Mail Center]
    AdminFeatures --> EntitySync[Entity Sync]
    AdminFeatures --> CRMSync[CRM Sync]
    AdminFeatures --> TransSync[Transaction Sync]
    AdminFeatures --> Mapping[Mapping Utility]
    AdminFeatures --> Settings[Settings]
    
    %% Manufacturer Flow
    MfrFlow --> MfrFeatures[Manufacturer Features]
    MfrFeatures --> MfrDashboard[Manufacturer Dashboard]
    MfrFeatures --> MfrSettings[Settings]
    
    %% Distributor Flow
    DistFlow --> DistFeatures[Distributor Features]
    DistFeatures --> DistDashboard[Distributor Dashboard]
    DistFeatures --> DistSettings[Settings]
    
    %% Master Data Management Details
    Masters --> Entities[Entity Management]
    Masters --> Products[Product Catalog]
    Entities --> MfrMgmt[Manufacturer Management]
    Entities --> DistMgmt[Distributor Management]
    Products --> ProductMgmt[Product Management]
    
    %% Sync Operations
    CRMSync --> FileUpload[File Upload]
    CRMSync --> SyncProcess[Sync Process]
    SyncProcess --> SyncStatus[Sync Status]
    
    TransSync --> TransMonitor[Transaction Monitoring]
    TransMonitor --> TransFilter[Filter & Search]
    
    %% Data Flow
    MfrMgmt --> Database[(Database)]
    DistMgmt --> Database
    ProductMgmt --> Database
    SyncProcess --> Database
    TransMonitor --> Database
    
    %% Context Providers
    AuthContext[Auth Context] --> Auth
    ThemeContext[Theme Context] --> AdminFlow
    ThemeContext --> MfrFlow
    ThemeContext --> DistFlow
    LanguageContext[Language Context] --> AdminFlow
    LanguageContext --> MfrFlow
    LanguageContext --> DistFlow
    
    %% Styling
    classDef userFlow fill:#e1f5fe
    classDef adminFlow fill:#f3e5f5
    classDef mfrFlow fill:#e8f5e8
    classDef distFlow fill:#fff3e0
    classDef dataFlow fill:#fce4ec
    classDef contextFlow fill:#f1f8e9
    
    class Start,Auth,Login,RoleCheck userFlow
    class AdminFlow,AdminFeatures,Masters,MailCenter,EntitySync,CRMSync,TransSync,Mapping,Settings adminFlow
    class MfrFlow,MfrFeatures,MfrDashboard,MfrSettings mfrFlow
    class DistFlow,DistFeatures,DistDashboard,DistSettings distFlow
    class Database,Entities,Products,MfrMgmt,DistMgmt,ProductMgmt,FileUpload,SyncProcess,SyncStatus,TransMonitor,TransFilter dataFlow
    class AuthContext,ThemeContext,LanguageContext contextFlow
```

## Component Architecture

```mermaid
graph TB
    %% Main App Structure
    App[App.tsx] --> Router[React Router]
    App --> Providers[Context Providers]
    
    %% Context Providers
    Providers --> ThemeProvider[Theme Provider]
    Providers --> LanguageProvider[Language Provider]
    Providers --> AuthProvider[Auth Provider]
    
    %% Layout Components
    Router --> Layout[Layout Component]
    Layout --> Header[Header Component]
    Layout --> Sidebar[Sidebar Component]
    Layout --> MainContent[Main Content Area]
    
    %% Authentication
    AuthProvider --> LoginForm[Login Form]
    AuthProvider --> AuthState[Authentication State]
    
    %% Page Components
    MainContent --> Dashboard[Dashboard Page]
    MainContent --> Masters[Masters Page]
    MainContent --> MailCenter[Mail Center Page]
    MainContent --> CRMSync[CRM Sync Page]
    MainContent --> TransSync[Transaction Sync Page]
    MainContent --> Mapping[Mapping Utility Page]
    MainContent --> Settings[Settings Page]
    
    %% Dashboard Components
    Dashboard --> MfrDashboard[Manufacturer Dashboard]
    Dashboard --> DistDashboard[Distributor Dashboard]
    Dashboard --> AdminDashboard[Admin Dashboard]
    
    %% Masters Components
    Masters --> EntityManagement[Entity Management]
    Masters --> ProductManagement[Product Management]
    EntityManagement --> MfrTable[Manufacturer Table]
    EntityManagement --> DistTable[Distributor Table]
    ProductManagement --> ProductTable[Product Table]
    
    %% Sync Components
    CRMSync --> FileUpload[File Upload Component]
    CRMSync --> SyncProgress[Sync Progress]
    CRMSync --> ActivityTimeline[Activity Timeline]
    
    TransSync --> TransTable[Transaction Table]
    TransSync --> FilterControls[Filter Controls]
    
    %% Styling
    classDef mainApp fill:#e3f2fd
    classDef providers fill:#f3e5f5
    classDef layout fill:#e8f5e8
    classDef pages fill:#fff3e0
    classDef components fill:#fce4ec
    
    class App,Router mainApp
    class ThemeProvider,LanguageProvider,AuthProvider providers
    class Layout,Header,Sidebar,MainContent layout
    class Dashboard,Masters,MailCenter,CRMSync,TransSync,Mapping,Settings pages
    class LoginForm,AuthState,MfrDashboard,DistDashboard,AdminDashboard,EntityManagement,ProductManagement,MfrTable,DistTable,ProductTable,FileUpload,SyncProgress,ActivityTimeline,TransTable,FilterControls components
```

## Data Flow & State Management

```mermaid
graph TB
    %% User Interactions
    UserAction[User Action] --> Component[React Component]
    
    %% State Management
    Component --> LocalState[Local State]
    Component --> ContextState[Context State]
    Component --> MockData[Mock Data]
    
    %% Context States
    ContextState --> AuthState[Auth State]
    ContextState --> ThemeState[Theme State]
    ContextState --> LanguageState[Language State]
    
    %% Data Operations
    LocalState --> CRUD[CRUD Operations]
    MockData --> CRUD
    CRUD --> DataUpdate[Data Update]
    DataUpdate --> UIUpdate[UI Update]
    
    %% Authentication Flow
    AuthState --> LoginProcess[Login Process]
    LoginProcess --> TokenStorage[Token Storage]
    TokenStorage --> RouteProtection[Route Protection]
    
    %% Theme & Language
    ThemeState --> ThemeToggle[Theme Toggle]
    LanguageState --> LanguageSwitch[Language Switch]
    ThemeToggle --> UIUpdate
    LanguageSwitch --> UIUpdate
    
    %% File Operations
    Component --> FileUpload[File Upload]
    FileUpload --> FileProcessing[File Processing]
    FileProcessing --> DataSync[Data Synchronization]
    
    %% Sync Operations
    DataSync --> SyncStatus[Sync Status]
    SyncStatus --> ProgressUpdate[Progress Update]
    ProgressUpdate --> UIUpdate
    
    %% Styling
    classDef user fill:#e1f5fe
    classDef state fill:#f3e5f5
    classDef data fill:#e8f5e8
    classDef sync fill:#fff3e0
    
    class UserAction,Component user
    class LocalState,ContextState,AuthState,ThemeState,LanguageState state
    class MockData,CRUD,DataUpdate,UIUpdate data
    class FileUpload,FileProcessing,DataSync,SyncStatus,ProgressUpdate sync
```

## Technology Stack & Dependencies

```mermaid
graph TB
    %% Frontend Framework
    React[React 18.3.1] --> TypeScript[TypeScript]
    React --> Vite[Vite Build Tool]
    
    %% UI Libraries
    React --> Antd[Ant Design 5.27.1]
    React --> Tailwind[Tailwind CSS]
    React --> FramerMotion[Framer Motion]
    
    %% Routing & State
    React --> ReactRouter[React Router DOM]
    React --> ContextAPI[React Context API]
    
    %% Icons & Utilities
    React --> LucideReact[Lucide React Icons]
    React --> SweetAlert2[SweetAlert2]
    React --> DayJS[Day.js]
    React --> Axios[Axios]
    
    %% Development Tools
    Vite --> ESLint[ESLint]
    Vite --> PostCSS[PostCSS]
    Vite --> Autoprefixer[Autoprefixer]
    
    %% Styling
    classDef framework fill:#e3f2fd
    classDef ui fill:#f3e5f5
    classDef routing fill:#e8f5e8
    classDef utils fill:#fff3e0
    classDef dev fill:#fce4ec
    
    class React,TypeScript,Vite framework
    class Antd,Tailwind,FramerMotion ui
    class ReactRouter,ContextAPI routing
    class LucideReact,SweetAlert2,DayJS,Axios utils
    class ESLint,PostCSS,Autoprefixer dev
```

## Key Features & Functionality

### 1. **Authentication & Authorization**
- Role-based access control (Admin, Manufacturer, Distributor)
- Mock authentication with localStorage persistence
- Protected routes and navigation

### 2. **Dashboard System**
- Role-specific dashboards with relevant metrics
- Real-time statistics and KPIs
- Interactive charts and progress indicators

### 3. **Master Data Management**
- Manufacturer and Distributor entity management
- Product catalog management
- CRUD operations with form validation
- Advanced filtering and search capabilities

### 4. **Synchronization Features**
- CRM data synchronization
- Transaction sync monitoring
- File upload and processing
- Real-time sync status tracking

### 5. **Multi-language Support**
- Hindi and English language support
- Context-based translation system
- Dynamic language switching

### 6. **Theme Management**
- Dark/Light theme support
- Dynamic theme switching
- Consistent color schemes across components

### 7. **Responsive Design**
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

## User Roles & Permissions

| Role | Dashboard Access | Masters | Mail Center | Entity Sync | CRM Sync | Transaction Sync | Mapping | Settings |
|------|------------------|---------|-------------|-------------|----------|------------------|---------|----------|
| **Admin** | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Manufacturer** | ✅ Limited | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ✅ Limited |
| **Distributor** | ✅ Limited | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ✅ Limited |

## File Structure Overview

```
DMS-Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   └── Layout/         # Layout components (Header, Sidebar)
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── ThemeContext.tsx # Theme management
│   │   └── LanguageContext.tsx # Internationalization
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx   # Role-based dashboards
│   │   ├── Masters.tsx     # Master data management
│   │   ├── CRMSync.tsx     # CRM synchronization
│   │   ├── TransactionSync.tsx # Transaction monitoring
│   │   └── ...             # Other pages
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Build configuration
```

This DMS system provides a comprehensive solution for managing FMCG distribution networks with role-based access, real-time synchronization, and modern UI/UX design patterns.
