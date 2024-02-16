import Messages from "../Model/MessageMode.js";

export const addMessage = async (req, res, next) => {
    try {
        const { from, to, message, image } = req.body;
        const data = await Messages.create({
            message: { text: message, image: image },
            users: [ from, to ],
            sender: from,
        })
        if(data) {
            return res.json({msg: "Message added successfully."})
         } else {
            return res.json({msg: "Failed to added message to database."})
         }
        
    } catch (error) {
         next(error)
    }
}

export const getAllMessage = async (req, res, next) => {
    try {
        const { from , to } = req.body;
        const messages = await Messages.find({
           users: {
           $all: [from, to],
        }
     }).sort({ updatedAt: 1 });
     const projectMessages = messages.map((msg) => {
        return {
           fromSelf: msg.sender.toString() === from,
           message: msg.message.text,
           image: msg.message.image
        }
     });
     return res.json(projectMessages);
      } catch (ex) {
         next(ex)
      }
}
