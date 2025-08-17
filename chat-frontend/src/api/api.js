import axios from "axios";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('api/account/register/', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    else {
      throw { error: "Something went wrong. Please try again later." };
    }

  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/account/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      const accessToken = data.token.access;
      const refreshToken = data.token.refresh;

      // Save tokens in local storage
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      console.log("Login successful. Tokens saved.");
      return data;

    } else {
      console.error("Login failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};


export const getProfile = async () => {
  const accessToken = sessionStorage.getItem('accessToken');
  console.log("Access token", accessToken);

  if (!accessToken) throw new Error('Access token is missing');

  const response = await api.get('http://127.0.0.1:8000/api/account/profile/', {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  console.log("API response", response.data);

  if (response.status !== 200) {
    throw new Error('Failed to fetch profile');
  }
  else {
    return response.data;
  }
};

export const uploadProfilePicture = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('profile_picture', file);

  const res = await axios.put(`http://127.0.0.1:8000/api/account/profile/
`, formData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};


export const log_out = async (accessToken, refreshToken) => {
  if (!refreshToken) throw new Error("refresh token is missing");
  const response = await axios.post('http://127.0.0.1:8000/api/account/logout/',
    {
      refresh: refreshToken
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,

      },
    });
  return response.data;
};

export const SendResetPasswordEmail = async (email) => {
  const response = await axios.post("http://127.0.0.1:8000/api/account/send_reset_password_email/",
    {
      email: email
    },
    {
      headers: {
        "Content-Type": "application/json",
      }
    });

  return response.data;
};

export const ResetPassword = async (uid, token, newPassword, confirmPassword) => {
  const response = await axios.post(`http://127.0.0.1:8000/api/account/reset_password/${uid}/${token}/`,
    {
      password: newPassword,
      password2: confirmPassword,
    },
    {
      headers: {
        "Content-Type": "application/json",
      }
    });

  return response.data;
}

export default api;



// Helper function to include the Authorization header
const getAuthHeaders = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("No access token found");
    return { headers: { "Content-Type": "application/json" } };
  }
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

// API method

export const sendFriendRequest = async (receiver_id) => {
  try {
    const response = axios.post(`http://127.0.0.1:8000/api/contact/friend-request/`,
      { receiver_id: receiver_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error.response?.data || error);
    throw error;
  }
};

export const viewFriendRequest = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/contact/friend-request/view/", getAuthHeaders());

    const data = await response.json();
    console.log("API Response Data:", data);

    return { data };
  } catch (error) {
    console.error("API call failed:", error);
    return { data: [] };
  }
};


export const RespondToRequest = async (request_id, action) => {
  try {
    const response = axios.post(`http://127.0.0.1:8000/api/contact/friend-requests/respond/${request_id}/`,
      { action },
      getAuthHeaders());
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error sending friend request", error.response?.data || error);
    throw error;
  }
};

export const ViewFriendList = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/contact/friends/`,
      getAuthHeaders()
    );

    console.log("API Response Data:", response.data);

    return { data: response.data };

  } catch (error) {
    console.error("API call failed:", error);
    return { data: [] };
  }
};

// remove the friends 
export const removeFriend = async (friendId) => {
  try {
    const response = axios.delete(`http://127.0.0.1:8000/api/contact/friends/${friendId}/`, getAuthHeaders());

    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
  }
};

export const blockUser = async (block_user_id) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/contact/block-user/`,
      { block_user_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
    return null;
  }
};

export const respondBlockUser = async (user_id,action) =>{
  try{
    const response = await axios.post(
      `http://127.0.0.1:8000/api/contact/block-requests/respond/`,
      {user_id,action},
      getAuthHeaders()
    );
    return response.data;
  }catch(error){
    console.log('Error to block user',error);
    return null;
  }
};

export const fetchBlockedUser = async () => {
  return axios.get(`http://127.0.0.1:8000/api/contact/blocked-users/`,
    getAuthHeaders()
  );
};

export const findFriend = async (query) => {
  return axios.get(`http://127.0.0.1:8000/api/contact/find-friend/?query=${query}`,
    getAuthHeaders()
  );
};

export const addFriend = async (friendId) => {
  return axios.post(`http://127.0.0.1:8000/api/contact/add-friend/`,
    { friend_id: friendId },
    getAuthHeaders()
  );
};

export const createOrGetChatRoom = async (user2_id) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/contact/chat-room/private/`,
      { user2_id: user2_id },
      getAuthHeaders()
    );
    console.log("api response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create chat room:", error);
    return null;
  }
};


export const fetchMessage = async (roomId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/contact/chat-room/message/${roomId}/`,
      { roomId },
      getAuthHeaders()
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Failed Error fetching message", error);
    return null;
  }
};


export const uploadMedia = async (roomId, mediaFile) => {
  try {
    const formData = new FormData();
    formData.append('media', mediaFile);
    const response = await axios.post(
      `http://127.0.0.1:8000/api/contact/chat/${roomId}/media/`,
      formData,
      {
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('media upload', response.data);
    return response.data;
  } catch (error) {
    console.error('Media upload failed', error);
    return null;
  }
};