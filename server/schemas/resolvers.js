const { User } = require("../models"); // Import User model
const { signToken } = require("../utils/auth"); // Import signToken utility for JWT signing

const resolvers = {
  Query: {
    // me: Returns the currently authenticated user
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }
      const userData = await User.findById(context.user._id);
      return userData;
    },
    getSwap: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }
      const userData = await User.findById(context.user._id);
      return userData;
    },
  },

  Mutation: {
    // login: Logs in a user by email and password and returns an Auth type
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    // addUser: Creates a new user and returns an Auth type with token
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      const token = signToken(user);
      return { token, user };
    },

    // saveBook: Adds a book to the user's savedBooks array
    saveBook: async (parent, { bookInput }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookInput } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    claimBook: async (parent, { bookInput }, context) => {
      console.log("Incoming Data: ", bookInput);
      const removeId = bookInput.bookId;

      if (!context.user) {
        throw new Error("You must be logged in!");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { 
          $addToSet: { savedBooks: bookInput },
        },
        { new: true, runValidators: true }
      );

      const updatedSwap = await User.findOneAndUpdate(
        { email: bookInput.ownerEmail },
        { 
          $pull: { swapBooks: { removeId } },
        },
        { new: true, runValidators: true }
      );

      console.log("Updated User: ", updatedUser);
      console.log(updatedSwap);
      return updatedUser;
    },

    // removeBook: Removes a book from the user's savedBooks array
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
    updateBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }
      const updatedStatus = await Book.findOneAndUpdate(
        { _id: context.bookId._id },
        { $pull: { status: { status } } },
        { new: true }
      );

      if (!updatedStatus) {
        throw new Error("Couldn't find book with this id!");
      }

      return updatedStatus;
    },
    swapBook: async (parent, { bookInput }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in!");
      }
      const user = await User.findOne({ _id: context.user._id });
      var isInArray =
        user.swapBooks.find(function (book) {
          return book.bookId === bookInput.bookId;
        }) !== undefined;

      console.log(isInArray);

      // const addToSwap = await User.findOneAndUpdate(
      //   { _id: context.user._id },
      //   {
      //     // $cond: {
      //     //   if: isInArray,
      //     //   then: {
      //     //     $addToSet: { swapBooks: bookInput },
      //     //     $pull: { savedBooks: { bookId: bookInput.bookId } },
      //     //   },
      //     //   else: { $pull: { savedBooks: { bookId: bookInput.bookId } } },
      //     // },
      //     $cond: [
      //       !isInArray,
      //       {
      //         $addToSet: { swapBooks: bookInput },
      //         $pull: { savedBooks: { bookId: bookInput.bookId } },
      //       },
      //       { $pull: { savedBooks: { bookId: bookInput.bookId } } },
      //     ],
      //   },

      //   { new: true }
      // );
      // if (!addToSwap) {
      //   throw new Error("Couldn't add book to swap!");
      // }

      // return addToSwap;

      if (isInArray) {
        console.log("Already in Swap Books!");
        const removeFromSave = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: { bookId: bookInput.bookId } },
          },
          { new: true }
        );
        if (!removeFromSave) {
          throw new Error("Couldn't add book to swap!");
        }
        return removeFromSave;
      } else {
        const addToSwap = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { swapBooks: bookInput },
            $pull: { savedBooks: { bookId: bookInput.bookId } },
          },
          { new: true }
        );
        if (!addToSwap) {
          throw new Error("Couldn't add book to swap!");
        }
        return addToSwap;
      }

      // const removeFromSaved = await User.findOneAndUpdate(
      //   { _id: context.user._id },
      //   { $pull: { savedBooks: { bookId } } },
      //   { new: true }
      // );

      // if (!removeFromSaved) {
      //   throw new Error("Couldn't remove this book from saved books!");
      // }
    },
  },
};

module.exports = resolvers;
