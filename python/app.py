import logging  # Add this import at the top
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from flask_cors import CORS

# Configure logging at application start
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
app.logger.setLevel(logging.INFO)  # Set logger level for Flask
CORS(app)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def sort_rows(nlq, rows):
    # Compute embeddings
    nlq_embedding = embedding_model.encode(nlq, convert_to_tensor=True)
    rows_embeddings = [
        embedding_model.encode(str(row), convert_to_tensor=True) for row in rows
    ]

    # Calculate cosine similarity
    similarity = [
        util.pytorch_cos_sim(nlq_embedding, row_embedding)
        for row_embedding in rows_embeddings
    ]

    # Sort based on similarity
    sorted_rows = [row for _, row in sorted(zip(similarity, rows), reverse=True)]
    return sorted_rows


@app.route("/sort", methods=["POST"])
def sort_endpoint():
    app.logger.info("Sort endpoint called with data: %s", request.json)
    try:
        data = request.json
        nlq = data.get("nlq")
        rows = data.get("rows")

        if not nlq or not rows:
            app.logger.warning("Missing nlq or rows in request")
            return jsonify({"error": 'Both "nlq" and "rows" are required.', "status": False}), 400

        app.logger.info("Starting similarity computation")
        sorted_result = sort_rows(nlq, rows)
        app.logger.info("Successfully sorted %d rows", len(rows))
        
        return jsonify({"sorted_rows": sorted_result, "status": True})
    
    except Exception as e:
        app.logger.error("Error in sorting: %s", str(e), exc_info=True)
        return jsonify({"error": str(e), "status": False}), 500


if __name__ == "__main__":
    # Development server with hot reload
    app.run(host="0.0.0.0", port=8000, debug=True, use_reloader=True)
    
    # Production configuration (keep waitress as alternative)
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=8000)