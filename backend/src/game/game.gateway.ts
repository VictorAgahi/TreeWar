import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';

export interface MoveData {
  room?: string;
  lat: number;
  lng: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {
    this.logger.log(this.gameService.getHello());
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.room);
    this.logger.log(`Client ${client.id} joined room ${data.room}`);
    this.server
      .to(data.room)
      .emit('room_joined', { client: client.id, room: data.room });
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: MoveData, @ConnectedSocket() client: Socket) {
    this.logger.log(`Move event from ${client.id}: ${JSON.stringify(data)}`);
    if (data.room) {
      client.to(data.room).emit('player_moved', { client: client.id, ...data });
    } else {
      client.broadcast.emit('player_moved', { client: client.id, ...data });
    }
  }
}
