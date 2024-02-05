# Ministry of Education Portal

### 1.  Problem Statement (Motivation)
In Ethiopia, accessing the Grade 12 University Entrance Exam Result on the Ministry of Education's website becomes highly challenging due to overwhelming traffic. With more than 500,000 students taking the University Entrance Exam each year, the Ministry of Education's website struggles to handle the massive load during the result publication period. This overload causes frustration and inconvenience for students who need to repeatedly attempt result retrieval. To address this issue, our project aims to provide a scalable and reliable solution.

### 2. Solution Overview
    
Our project includes a thoughtfully designed distributed system, where server components are positioned for optimal performance and the ability to withstand faults. These components comprise:
- **Load Balancer:** Responsible for distributing incoming requests evenly across replicated servers, preventing the overloading of any single server and ensuring optimal performance. Utilizing a combination of a Geo-based Load Balancing algorithms for request distribution and distance calculation to optimize server selection based on the user's location, this server ensures efficiency and responsiveness.
- **Authentication Servers**: Responsible for user authentication and authorization, these servers guarantee that only authorized Ministry of Education administrators can securely upload exam results.
- **Backend Server:** This manages incoming requests. Importantly, it doesn't mandate students to be authenticated to view their results; rather, it prioritizes authentication and authorization for result uploads. To achieve this, it communicates with the Authentication Server using RPC API, ensuring that only authenticated and authorized administrators can upload results securely.
- **MySQL Server :** The integration of MySQL server enhances our data management capabilities, providing a robust foundation for storing and retrieving crucial data such as exam results in an organized and scalable manner.
- **Frontend :** The user interface, built with ReactJS, offers a user-friendly experience for students to effortlessly retrieve their exam results and submit any necessary complaints.
- **Real-time Petition Handling:** This feature, allows students to submit complaints directly to the Ministry of Education. It facilitates the concurrent file edition between students.
### 3. **Technologies Used**
- **Golang**: used for developing all servers except the frontend.
- **ReactJS**: utilized for building the frontend, providing an interactive user interface.
- **MySQLDB**: Database technology for storing and managing exam results and other relevant data.
- **RPC API**: Facilitates communication between different components of the distributed system.
- **Token-based Authentication and Authorization**: Ensures secure access to the system, allowing only authenticated and authorized users.
- --
## Installation Guide
1. clone this repository
2. for each server configure the mysql server according to your local mysql configuration
3. run your etcd donwloaded locally for continuous sync between the servers
4. run each server
5. access the project through the forntend UI on the browser through `localhost:3000`

### Contributors
1. Tofik Abdu ........... UGR/1721/13
2. Nahom Amare ..... UGR/7099/13
3. Tadael Shewarega ........UGR/1044/13
4. Thomas Wondwosen ..... UGR/1972/13
5. Habiba Nesro ...................  UGR/0088/13  
