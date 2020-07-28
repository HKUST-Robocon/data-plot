const LOOP_INTERVAL = 30;
let stack = 0;

/**
 * Check if Web Serial API available or not.
 * 
 * @returns true if the API is available
 */
export const isAPIAvailable = () => {
    return 'serial' in navigator;
}

/**
 * Access a serial port.
 * 
 * @param options the configuration of accessing the serial port, please refer to https://wicg.github.io/serial/
 * 
 * @returns a opened serial port
 */
export const accessSerialPort = async (options = {
    baudrate: 115200
}) => {
    const port = await navigator.serial.requestPort().catch(e => {
        console.log(e);
    });
    if (!port) return null;
    await port.open({
        baudrate: 115200
    });
    return new COMPort(port);
}

class COMPort {
    uart;
    decoder;
    encoder;
    inputDone;
    inputStream;
    reader;
    readerLoop;
    rawMsg = "";
    decodeMsg = [];
    registered = [];
    lastTicks = (new Date()).getTime();
    destroy = false;

    constructor(uart) {
        this.uart = uart;
        this.decoder = new window.TextDecoderStream();
        this.inputDone = uart.readable.pipeTo(this.decoder.writable);
        this.inputStream = this.decoder.readable;
        this.reader = this.inputStream.getReader();

        setTimeout(this.receiveRawMsg, 0);
    }

    receiveRawMsg = () => {
        if (this.destroy) return;
        console.log('stacked message: ' + this.rawMsg);
        this.reader.read().then(reading => {
            console.log('read');
            this.rawMsg += reading.value;
            while (1) {
                const result = this.parseJSON(this.rawMsg);
                if (stack > 10)
                    return;
                if (result) {
                    try {
                        this.rawMsg = this.rawMsg.substring(result.endIndex + 1);
                        console.log(JSON.parse(result.parsable));
                        this.decodeMsg.push(JSON.parse(result.parsable));
                        this.registered.forEach((decoder, i) => {
                            const msg = this.decodeMsg[this.decodeMsg.length - 1]
                            if (decoder.type === msg.type)
                                decoder.listener(msg);
                        });
                    } catch (e) {
                        // maybe there are noises during transmittion, so it fks up
                        console.error(e);
                    }
                } else break;
            }


            const ticks = (new Date()).getTime();
            if (ticks - this.lastTicks > LOOP_INTERVAL) {
                console.log('call instantly');
                this.lastTicks = ticks;
                this.receiveRawMsg();
            } else {
                console.log('call later');

                setTimeout(this.receiveRawMsg, LOOP_INTERVAL - ticks + this.lastTicks);
                this.lastTicks = ticks;
            }
        });
    }

    async disconnect() {
        this.destroy = true;
        await this.reader.cancel();
        await this.inputDone.catch(() => { });
        await this.uart.close();
    }

    parseJSON(message) {
        const openBracket = message.indexOf('{');
        const openBracket2 = message.indexOf('{', openBracket + 1);
        const closeBracket = message.indexOf('}');

        if (openBracket === -1 || closeBracket === -1) return null;

        /**
         * For case } {{ / } {
         */
        if (Math.min(openBracket, openBracket2) > closeBracket && message.indexOf('}', openBracket)) {
            console.log('search again');
            if (stack > 10) {
                console.log('stack: ' + message);
                return;
            }
            stack++;
            return this.parseJSON(message.substring(closeBracket + 1));
        }
        stack = 0;
        let realOpenBracket = -1;

        if (openBracket2 > openBracket && openBracket2 < closeBracket) {
            realOpenBracket = openBracket2;
        } else if (openBracket < closeBracket) {
            realOpenBracket = openBracket;
        }

        return realOpenBracket !== -1 ? {
            parsable: message.substring(realOpenBracket, closeBracket + 1),
            endIndex: closeBracket
        } : null;
    }

    /**
     * Register listener. The listener will be called if a message is received, and message type is matched.
     * To withdraw listener, don't pass anonymous function.
     * 
     * @param type message type of listener
     * @param listener listener to register
     */
    on(type, listener) {
        this.registered.push({
            type: type,
            listener: listener
        });
    }

    /**
     * remove listener.
     * 
     * @param type message type of listener
     * @param listener listener to remove
     */
    off(type, listenr) {
        for (let i in this.registered) {
            const decoder = this.registered[i];
            if (decoder.type === type && decoder.listener === listenr) {
                this.registered.splice(i, 1);
                return;
            }
        }
    }
}