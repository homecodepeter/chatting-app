import User from "../Model/User.js";

export const getUser = async (req, res) => {
   try {
       const { id } = req.params;
       const user = await User.findById(id);
       res.status(200).json(user);
   } catch (error) {
       res.status(404).json({ Message: error.message })
   }

}

export const getAllUser = async (req, res, next) => {
     try {
      const users = await User.find({_id:{ $ne: req.params.id }}).select('email name profileImage _id friendList');
      res.json(users);
     } catch (error) {
       next(error)
     }
}

export const getAllFriendList = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = User.findById(id)
      const friends = await Promise.all(
         user.friendList.map((id) => user.findById(id))
      )
      const formettedFriends = friends.map(
         ({ _id, profileImage, name, email, friendList }) => {
            return { _id, profileImage, name, email, friendList}
         })
     return res.json(formettedFriends);
      } catch (ex) {
         next(ex)
      }
}

export const getSearchUser = async (req, res, next) => {
    try {
       const { search } = req.body;
       const user = await User.find({ name: search });
       res.json(user);
    } catch (error) {
      next(error)
    }
}

export const AddFriendToYourList = async (req,res,next) => {
   try {
      const { id, friendId } = req.params;
      const friend = await User.findById(friendId);
      const user = await User.findById(id);

       if(user.friendList.includes(friendId)){
         user.friendList = user.friendList.filter((id) => id !== friendId);
         friend.friendList = friend.friendList.filter((id) => id !== id);
       }else {
          user.friendList.push(friendId);
          friend.friendList.push(id);
       }

       await user.save();
       await friend.save();

       const friends = await Promise.all(
         user.friendList.map((id) => User.findById(id))
     )
     console.log(friends)
     const formettedFriends = friends.map(
         ({_id, name, email, profileImage, friendList}) => {
             return {_id, name, email, profileImage, friendList}
         }
     );
     res.status(200).json(formettedFriends);

   } catch (error) {
      next(error)
   }
}