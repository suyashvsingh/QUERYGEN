# QUERYGEN

A natural language to SQL converter using GPT-4o-mini and semantic search. This project provides a web interface where users can input queries in plain English and receive generated SQL queries with their results.

---

## 🚀 Overview of Architecture

The system is implemented using a modular microservice architecture comprising the following components:

- **Client (Next.js):**  
  Provides a user-friendly web interface to input queries in natural language and display results.

- **Server (Node.js):**  
  Handles the generation of SQL queries using the GPT-4o-mini model, manages prompt engineering, and coordinates communication between services.

- **Python Server (Flask):**  
  Computes the semantic similarity between the user query and database rows using the `all-MiniLM-L6-v2` embedding model to select relevant context for SQL generation.

This architecture enables clear separation of concerns, scalability, and ease of maintenance.

---

## 🛠️ Running the Application

Follow these steps to set up and run the QUERYGEN application on your local machine.

### **Prerequisites**

- Python 3.8+
- Node.js (v16 or higher)
- npm
- [OpenAI API key](https://platform.openai.com/account/api-keys)

---

### **1. Clone the Repository**

```
git clone https://github.com/suyashvsingh/QUERYGEN
cd QUERYGEN
```

---

### **2. Set Up and Start the Python Server**

```
cd python
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
> **Note:** Leave this terminal window open while the server is running.

---

### **3. Set Up and Start the Node.js Server**

Open a **new** terminal window or tab:

```
cd QUERYGEN/server
npm install
```

Create a file named `.env` in the `server` directory with the following content (replace with your actual OpenAI API key):

```
OPENAI_API_KEY=
MODEL=gpt-4o-mini
```

Start the Node.js server:

```
npm start
```
> **Note:** Leave this terminal window open while the server is running.

---

### **4. Build and Start the Client**

Open another **new** terminal window or tab:

```
cd QUERYGEN/client
npm install
npm run build
npm start
```

By default, the client will be available at [http://localhost:3000](http://localhost:3000).

---

## 💡 Usage

After completing the setup, open your browser and navigate to [http://localhost:3000](http://localhost:3000).  
You can now input natural language queries and view the generated SQL queries and their results.

> **Important:** Ensure all three services (Python server, Node.js server, and client) are running simultaneously in separate terminal windows or tabs.

---

## 📁 Project Structure

```
QUERYGEN/
├── client/      # Next.js frontend
├── server/      # Node.js backend (SQL generation & coordination)
├── python/      # Python Flask server (semantic similarity)
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to [open an issue](https://github.com/suyashvsingh/QUERYGEN/issues) or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/)
- [Sentence Transformers](https://www.sbert.net/)
- [Next.js](https://nextjs.org/)
