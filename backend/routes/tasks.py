from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Task

tasks = Blueprint('tasks', __name__)

@tasks.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        all_tasks = Task.query.all()
        result = []
        for t in all_tasks:
            result.append({
                'id': t.id,
                'title': t.title,
                'priority': t.priority,
                'status': t.status,
                'due_date': str(t.due_date) if t.due_date else None
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tasks.route('/api/tasks', methods=['POST'])
@jwt_required()
def add_task():
    try:
        data = request.get_json(force=True)
        new_task = Task(
            title=data.get('title'),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'pending')
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tasks.route('/api/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    try:
        task = Task.query.get(id)
        if not task:
            return jsonify({"error": "Task not found!"}), 404
        data = request.get_json(force=True)
        task.title = data.get('title', task.title)
        task.priority = data.get('priority', task.priority)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify({"message": "Task updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tasks.route('/api/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    try:
        task = Task.query.get(id)
        if not task:
            return jsonify({"error": "Task not found!"}), 404
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500