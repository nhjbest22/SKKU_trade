from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # 실제 비밀 키로 변경하세요
socketio = SocketIO(app, cors_allowed_origins='*')  # CORS 허용

@app.route('/')
def index():
    return render_template('index.html')

# 클라이언트로부터 메시지를 받았을 때 처리
@socketio.on('send_message')
def handle_send_message_event(data):
    app.logger.info(f"{data['username']}님이 메시지를 보냈습니다: {data['message']}")
    emit('receive_message', data, broadcast=True)

# 예약 확정 메시지를 받았을 때 처리
@socketio.on('reservation_confirmed')
def handle_reservation_confirmed_event(data):
    app.logger.info(f"{data['username']}님이 예약을 확정했습니다: {data['date']} {data['time']} {data['place']}")
    emit('receive_reservation_confirmation', data, broadcast=True)

# 클라이언트가 연결되었을 때 처리
@socketio.on('connect')
def handle_connect():
    app.logger.info("클라이언트가 연결되었습니다.")

# 클라이언트가 연결을 끊었을 때 처리
@socketio.on('disconnect')
def handle_disconnect():
    app.logger.info("클라이언트가 연결을 끊었습니다.")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)
