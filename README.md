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

- [Docker](https://docs.docker.com/engine/install/)
- [OpenAI API key](https://platform.openai.com/account/api-keys)

---

### **1. Clone the Repository**

```
git clone https://github.com/suyashvsingh/QUERYGEN
```

---

### **2. Create .env file**

Inside the `QUERYGEN` directory, create a `.env` file with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
MODEL=gpt-4o-mini
```
Replace `your_openai_api_key_here` with your actual OpenAI API key.

---

### **3. Run docker-compose.yaml file**

```
cd QUERYGEN
docker compose up
```

---

## 💡 Usage

After completing the setup, open your browser and navigate to [http://localhost:3000](http://localhost:3000).  
You can now input natural language queries and view the generated SQL queries and their results.

---

## 📁 Project Structure

```
QUERYGEN/
├── client/      # Next.js frontend
├── server/      # Node.js backend (SQL generation & coordination)
├── python/      # Python Flask server (semantic similarity)
├── .env         # Environment variables
├── docker-compose.yaml  # Docker Compose configuration
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

---

## 📊 Evaluation

The QUERYGEN system was tested using the [Spider dataset](https://yale-lily.github.io/spider), a benchmark for text-to-SQL tasks. The results across different difficulty levels are as follows:

| Difficulty Level | Execution Accuracy (EX) |
|------------------|------------------------|
| Easy             | 90.0%                  |
| Medium           | 73.0%                  |
| Hard             | 69.8%                  |
| Extra            | 65.0%                  |
| **Overall**      | **75.2%**              |

**Interpretation:**  
QUERYGEN achieves strong performance, especially on easy and medium queries, and maintains robust accuracy even on complex and extra-hard tasks.
