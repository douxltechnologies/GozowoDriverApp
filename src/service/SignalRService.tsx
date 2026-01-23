import * as signalR from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';

type CallListener = (callData: any) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private callListeners: CallListener[] = [];
  private hubUrl: string | URL = '';
  private token: string = '';

  /** Start SignalR connection */
  async startConnection(hubUrl: string | URL, token: string) {
    if (!hubUrl) throw new Error('hubUrl is required');
    if (!token) throw new Error('token is required');

    this.hubUrl = hubUrl;
    this.token = token;

    const urlString = typeof hubUrl === 'string' ? hubUrl : hubUrl.toString();

    // Stop existing connection if any
    if (this.connection) {
      await this.stopConnection();
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(urlString, { accessTokenFactory: () => this.token })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          console.log('SignalR reconnect attempt', retryContext.previousRetryCount + 1);
          return 5000; // retry every 5 seconds
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Reconnection handlers
    this.connection.onreconnecting((err) => {
      console.warn('SignalR reconnecting...', err);
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.connection.onclose((err) => {
      console.warn('SignalR connection closed', err);
    });

    // Register listener
    this.connection.on('IncomingCall', (data) => {
      console.log('IncomingCall received:', data); // debug log
      this.callListeners.forEach((listener) => listener(data));
    });
    this.connection.on('CallStatus', (data) => {
      console.log('IncomingCall Status::::::', data); // debug log
      this.callListeners.forEach((listener) => listener(data));
    });
    await this.tryStartConnection();
  }

  /** Try to start connection with retry */
  private async tryStartConnection() {
    if (!this.connection) return;

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR connection error:', err);
      setTimeout(() => this.tryStartConnection(), 5000);
    }
  }

  /** Stop the connection */
  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.warn('Error stopping SignalR:', err);
      }
      this.connection = null;
      console.log('SignalR Disconnected');
    }
    this.callListeners = [];
  }

  /** Add a listener for incoming calls */
  addCallListener(callback: CallListener) {
    if (!callback) return;
    this.callListeners.push(callback);
  }

  /** Remove a specific listener */
  removeCallListener(callback: CallListener) {
    this.callListeners = this.callListeners.filter((l) => l !== callback);
  }

  /** Remove all call listeners */
  removeAllCallListeners() {
    this.callListeners = [];
  }

  /** Send call signal to server */
async sendCallSignal(targetId: string, callData: string | object) {
    if (
        !this.connection ||
        this.connection.state !== signalR.HubConnectionState.Connected
    ) {
        console.warn('SignalR not connected yet');
        return;
    }

    // Ensure callData is a JSON string
    const callDataStr =
        typeof callData === 'string'
            ? callData
            : JSON.stringify(callData);

    try {
        await this.connection.invoke(
            'InitiateCall',
            targetId,
            callDataStr
        );
        console.log(`Call initiated to ${targetId}`);
    } catch (err) {
        console.error('SendCallSignal error:', err);
    }
}
async sendCallStatus(targetId: string, status: string | object,reason:string) {
    if (
        !this.connection ||
        this.connection.state !== signalR.HubConnectionState.Connected
    ) {
        console.warn('SignalR not connected yet');
        return;
    }

    // Ensure callData is a JSON string
    const callDataStr =
        typeof status === 'string'
            ? status
            : JSON.stringify(status);

    try {
        await this.connection.invoke(
            'SendCallStatus',
            targetId,
            callDataStr,
            reason,
        );
        console.log(`Call initiated to ${targetId}`);
    } catch (err) {
        console.error('SendCallSignal error:', err);
    }
}
}

export default new SignalRService();
