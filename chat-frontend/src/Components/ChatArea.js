// import React, { useEffect, useState, useRef } from 'react';
// import { uploadMedia } from '../api/api';
// import JitsiEmbed from './JitsiEmbed';

// const ChatArea = ({ friend }) => {
//     const [messages, setMessages] = useState([]);
//     const [inputMessage, setInputMessage] = useState("");
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [showJitsi, setShowJitsi] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const [audioChunks, setAudioChunks] = useState([]);

//     const socketRef = useRef(null);
//     const messageEndRef = useRef();

//     const user = JSON.parse(sessionStorage.getItem('user'));
//     const currentEmail = user?.email;
//     console.log("current email", currentEmail);

//     const messageStyle = {
//         container: {
//             display: "flex",
//             flexDirection: "column",
//             padding: "10px",
//             overflowY: "auto",
//             flex: 1,
//             backgroundColor: "#f0f0f0",
//         },
//         bubble: {
//             maxWidth: "60%",
//             padding: "10px",
//             marginBottom: "10px",
//             borderRadius: "15px",
//             wordWrap: "break-word",
//             fontSize: "14px",
//             color: "#000",
//         },
//         you: {
//             alignSelf: "flex-end",
//             backgroundColor: "#dcf8c6",
//             border: "1px solid #ccc",
//         },
//         them: {
//             alignSelf: "flex-start",
//             backgroundColor: "#fff",
//             border: "1px solid #ccc",
//         },
//     };

//     useEffect(() => {
//         const connectWebSocket = async () => {
//             try {
//                 const roomId = friend.id;
//                 if (roomId) {
//                     const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}`);
//                     socketRef.current = ws;

//                     ws.onopen = () => console.log("WebSocket connected");

//                     ws.onmessage = (event) => {
//                         const data = JSON.parse(event.data);
//                         console.log("Received on socket:", data);

//                         setMessages((prev) => [
//                             ...prev,
//                             {
//                                 text: data.message,
//                                 sender: data.sender,
//                                 receiver: data.receiver,
//                             },
//                         ]);
//                     };

//                     ws.onclose = () => console.log("WebSocket disconnected");
//                 }
//             } catch (error) {
//                 console.error("Error connecting to WebSocket:", error);
//             }
//         };

//         connectWebSocket();

//         return () => {
//             if (socketRef.current) socketRef.current.close();
//         };
//     }, [friend]);

//     useEffect(() => {
//         messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const handleSendMessage = async () => {
//         if (socketRef.current && inputMessage.trim()) {
//             const messageData = {
//                 message: inputMessage.trim(),
//                 sender: currentEmail,
//                 receiver: friend.email,
//             };
//             socketRef.current.send(JSON.stringify(messageData));
//             setInputMessage("");
//         }

//         if (selectedFile) {
//             const result = await uploadMedia(friend.id, selectedFile);
//             const mediaURL = typeof result.media === "string"
//                 ? result.media.trim()
//                 : result.media?.url?.trim();

//             console.log("Uploading media URL:", mediaURL);

//             if (mediaURL) {
//                 const mediaMessage = {
//                     message: `📎 Media: ${mediaURL}`,
//                     sender: currentEmail,
//                     receiver: friend.email,
//                 };
//                 socketRef.current.send(JSON.stringify(mediaMessage));
//                 setSelectedFile(null);
//             }
//         }
//     };

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const recorder = new MediaRecorder(stream);
//             setAudioChunks([]);  // Reset before starting

//             recorder.ondataavailable = (event) => {
//                 setAudioChunks((prev) => [...prev, event.data]);
//             };

//             recorder.onstop = async () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//                 const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });

//                 const result = await uploadMedia(friend.id, audioFile);
//                 if (result && socketRef.current) {
//                     const audioMessage = {
//                         text: `🎤 Voice: ${result.media}`,
//                         sender: currentEmail,
//                     };
//                     socketRef.current.send(JSON.stringify(audioMessage));
//                     setMessages((prev) => [...prev, audioMessage]);
//                 }

//                 setAudioChunks([]);
//             };

//             setMediaRecorder(recorder);
//             recorder.start();
//             setIsRecording(true);
//         } catch (err) {
//             console.error("Recording failed:", err);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "10px" }}>
//             <h4 style={{ marginBottom: "10px", textAlign: "center" }}>{friend.name}</h4>

//             {showJitsi ? (
//                 <>
//                     <button
//                         onClick={() => setShowJitsi(false)}
//                         style={{
//                             marginBottom: "10px",
//                             padding: "10px 20px",
//                             borderRadius: "5px",
//                             backgroundColor: "#dc3545",
//                             color: "#fff",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                     >
//                         End Call
//                     </button>
//                     <JitsiEmbed
//                         roomName={`chatapp-${friend.id}-${currentEmail}`}
//                         onClose={() => setShowJitsi(false)}
//                     />
//                 </>
//             ) : (
//                 <>
//                     <button
//                         onClick={() => setShowJitsi(true)}
//                         style={{
//                             marginBottom: "10px",
//                             padding: "10px 20px",
//                             borderRadius: "5px",
//                             backgroundColor: "#007bff",
//                             color: "#fff",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                     >
//                         Start Call
//                     </button>

//                     <div style={messageStyle.container}>
//                         {messages.map((msg, index) => {
//                             const isYou = msg.sender === currentEmail;
//                             const baseURL = "http://127.0.0.1:8000";
//                             const isMedia = msg.text?.startsWith("📎 Media: ");
//                             const mediaLink = isMedia ? msg.text.replace("📎 Media: ", "").trim() : null;
//                             const finalMediaLink = mediaLink?.startsWith("/media")
//                                 ? `${baseURL}${mediaLink}`
//                                 : mediaLink;

//                             return (
//                                 <div
//                                     key={index}
//                                     style={{
//                                         ...messageStyle.bubble,
//                                         ...(isYou ? messageStyle.you : messageStyle.them),
//                                     }}
//                                 >
//                                     <strong style={{ fontSize: "0.8em", color: "#555" }}>
//                                         {isYou ? "You" : msg.sender}
//                                     </strong>
//                                     <div style={{ marginTop: "5px" }}>
//                                         {isMedia ? (
//                                             /\.(jpg|jpeg|png|gif)$/i.test(finalMediaLink) ? (
//                                                 <img src={finalMediaLink} alt="uploaded" style={{ maxWidth: "100%" }} />
//                                             ) : /\.(mp4|webm|ogg|wav)$/i.test(finalMediaLink) ? (
//                                                 <video controls style={{ maxWidth: "100%" }}>
//                                                     <source src={finalMediaLink} type="video/mp4/" />
//                                                     Your browser does not support the video tag.
//                                                 </video>
//                                             ) : /\.(mp4|webm|ogg|wav)$/i.test(finalMediaLink) ? (
//                                                 <video controls style={{ maxWidth: "100%" }}>
//                                                     <source src={finalMediaLink} type="video/mp4/" />
//                                                     Your browser does not support the video tag.
//                                                 </video>
//                                             ) : (
//                                                 <div>
//                                                     📄 {finalMediaLink.split("/").pop()} &nbsp;
//                                                     <a
//                                                         href={finalMediaLink}
//                                                         download
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                     >
//                                                         🔽 Download
//                                                     </a>
//                                                 </div>
//                                             )
//                                         ) : (
//                                             <div>
//                                                 {
//                                                     /^https?:\/\/\S+$/.test(msg.text) ? (
//                                                         <a
//                                                             href={msg.text}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             style={{ color: "#007bff", wordBreak: "break-word" }}
//                                                         >
//                                                             {msg.text}
//                                                         </a>
//                                                     ) : (
//                                                         msg.text
//                                                     )
//                                                 }
//                                             </div>

//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                         <div ref={messageEndRef} />
//                     </div>

//                     <div style={{ display: "flex", marginTop: "10px" }}>
//                         <input
//                             type="text"
//                             value={inputMessage}
//                             onChange={(e) => setInputMessage(e.target.value)}
//                             placeholder="Type a message..."
//                             style={{ flex: 1 }}
//                         />
//                         <input
//                             type="file"
//                             onChange={(e) => setSelectedFile(e.target.files[0])}
//                             style={{ marginLeft: "5px" }}
//                         />
//                         <button
//                             onClick={handleSendMessage}
//                             style={{
//                                 marginLeft: "-50px",
//                                 padding: "10px 20px",
//                                 borderRadius: "5px",
//                                 backgroundColor: "#4caf50",
//                                 color: "#fff",
//                                 border: "none",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Send
//                         </button>
//                         {!isRecording ? (
//                             <button onClick={startRecording} style={{ marginLeft: "5px", backgroundColor: "#f44336", color: "#fff" }}>
//                                 🎤 Record
//                             </button>
//                         ) : (
//                             <button onClick={stopRecording} style={{ marginLeft: "5px", backgroundColor: "#9c27b0", color: "#fff" }}>
//                                 ⏹️ Stop
//                             </button>
//                         )}

//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ChatArea;


import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Button, Stack, Paper } from '@mui/material';
import { Send, Mic, Stop, Call, CallEnd, AttachFile } from '@mui/icons-material';
import { uploadMedia } from '../api/api';
import JitsiEmbed from './JitsiEmbed';

const ChatArea = ({ friend }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showJitsi, setShowJitsi] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);

    const socketRef = useRef(null);
    const messageEndRef = useRef();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const currentEmail = user?.email;

    useEffect(() => {
        const connectWebSocket = () => {
            const roomId = friend.id;
            if (roomId) {
                const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}`);
                socketRef.current = ws;

                ws.onopen = () => console.log("WebSocket connected");

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: data.message,
                            sender: data.sender,
                            receiver: data.receiver,
                        },
                    ]);
                };

                ws.onclose = () => console.log("WebSocket disconnected");
            }
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [friend]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (socketRef.current && inputMessage.trim()) {
            socketRef.current.send(JSON.stringify({
                message: inputMessage.trim(),
                sender: currentEmail,
                receiver: friend.email,
            }));
            setInputMessage("");
        }

        if (selectedFile) {
            const result = await uploadMedia(friend.id, selectedFile);
            const mediaURL = typeof result.media === "string"
                ? result.media.trim()
                : result.media?.url?.trim();

            if (mediaURL) {
                const mediaMessage = {
                    message: `📎 Media: ${mediaURL}`,
                    sender: currentEmail,
                    receiver: friend.email,
                };
                socketRef.current.send(JSON.stringify(mediaMessage));
                setSelectedFile(null);
            }
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setAudioChunks([]);

            recorder.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });

                const result = await uploadMedia(friend.id, audioFile);
                if (result && socketRef.current) {
                    const audioMessage = {
                        text: `🎤 Voice: ${result.media}`,
                        sender: currentEmail,
                    };
                    socketRef.current.send(JSON.stringify(audioMessage));
                    setMessages((prev) => [...prev, audioMessage]);
                }

                setAudioChunks([]);
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Recording failed:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const baseURL = "http://127.0.0.1:8000";

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>{friend.name}</Typography>

            {showJitsi ? (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<CallEnd />}
                        onClick={() => setShowJitsi(false)}
                        sx={{ mb: 2 }}
                    >
                        End Call
                    </Button>
                    <JitsiEmbed
                        roomName={`chatapp-${friend.id}-${currentEmail}`}
                        onClose={() => setShowJitsi(false)}
                    />
                </>
            ) : (
                <>
                    <Button
                        variant="contained"
                        startIcon={<Call />}
                        onClick={() => setShowJitsi(true)}
                        sx={{ mb: 2 }}
                    >
                        Start Call
                    </Button>

                    <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                        {messages.map((msg, idx) => {
                            const isYou = msg.sender === currentEmail;
                            const isMedia = msg.text?.startsWith("📎 Media: ");
                            const mediaLink = isMedia ? msg.text.replace("📎 Media: ", "").trim() : null;
                            const finalMediaLink = mediaLink?.startsWith("/media")
                                ? `${baseURL}${mediaLink}`
                                : mediaLink;

                            return (
                                <Paper
                                    key={idx}
                                    elevation={1}
                                    sx={{
                                        p: 1,
                                        mb: 1,
                                        maxWidth: '70%',
                                        alignSelf: isYou ? 'flex-end' : 'flex-start',
                                        bgcolor: isYou ? '#e0f7fa' : '#ffffff',
                                        border: '1px solid #ccc'
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        {isYou ? "You" : msg.sender}
                                    </Typography>
                                    <Box mt={0.5}>
                                        {isMedia ? (
                                            /\.(jpg|jpeg|png|gif)$/i.test(finalMediaLink) ? (
                                                <img src={finalMediaLink} alt="media" style={{ maxWidth: "100%" }} />
                                            ) : /\.(mp4|webm|ogg|wav)$/i.test(finalMediaLink) ? (
                                                <video controls style={{ maxWidth: "100%" }}>
                                                    <source src={finalMediaLink} />
                                                </video>
                                            ) : (
                                                <Typography>
                                                    📄 {finalMediaLink.split("/").pop()}&nbsp;
                                                    <a href={finalMediaLink} download target="_blank" rel="noopener noreferrer">
                                                        🔽 Download
                                                    </a>
                                                </Typography>
                                            )
                                        ) : /^https?:\/\/\S+$/.test(msg.text) ? (
                                            <a href={msg.text} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                                                {msg.text}
                                            </a>
                                        ) : (
                                            msg.text
                                        )}
                                    </Box>
                                </Paper>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            fullWidth
                            size="small"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <IconButton component="label">
                            <AttachFile />
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </IconButton>
                        <IconButton onClick={handleSendMessage} color="success">
                            <Send />
                        </IconButton>
                        {!isRecording ? (
                            <IconButton onClick={startRecording} color="error">
                                <Mic />
                            </IconButton>
                        ) : (
                            <IconButton onClick={stopRecording} color="secondary">
                                <Stop />
                            </IconButton>
                        )}
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default ChatArea;
