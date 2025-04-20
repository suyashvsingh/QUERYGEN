from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from flask_cors import CORS

app = Flask(__name__)
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
    try:
        data = request.json
        nlq = data.get("nlq")
        rows = data.get("rows")

        if not nlq or not rows:
            return (
                jsonify(
                    {
                        "error": 'Both "nlq" and "rows" are required.',
                        "status": False,
                    }
                ),
                400,
            )
        sorted_result = sort_rows(nlq, rows)
        return jsonify({"sorted_rows": sorted_result, "status": True})
    except Exception as e:
        return (
            jsonify(
                {
                    "error": str(e),
                    "status": False,
                }
            ),
            500,
        )


if __name__ == "__main__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=8000)
