import mongoose from "mongoose";

const escalationSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    escalationType: { 
        type: String, 
        required: true 
    }, 
    status: { 
        type: String, 
        default: "open" 
    }, 
    raisedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    remarks: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});


export const Escalation = mongoose.model("Escalation", escalationSchema);
