import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { data } from "react-router-dom"
import toast from "react-hot-toast"
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";




export const useAuthStore = create((set,get) => ({
    
    authUser: null,
    isSigningUp: false,
    isLogginIng: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance("/auth/check")
            set({ authUser: res.data })
            get().connectSocket();

        } catch (error) {
            console.log("Error in CheckAuth:",error.message)
            set({authUser:null})
        }
        finally {
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account Created Successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({isSigningUp:false})
        }
        

    },

     login: async (data) => {
        set({ isLogginIng: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In successfully");
            get().connectSocket();
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({isLogginIng:false})
        }
        

    },


     logout: async (data) => {
    
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged Out Successfully")
             get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }

    },
     
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
         try {
             const res = await axiosInstance.put("/auth/update-profile", data)
             set({ authUser: res.data });
             toast.success("Profile Update Successfully")

         } catch (error) {
                console.log("Error in update Profile",error)
                toast.error(error.response.data.message)
         }
         finally {
             set({isUpdatingProfile:false})
             
        }
    },
    
 connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    },
    

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    },
  
  
}))

