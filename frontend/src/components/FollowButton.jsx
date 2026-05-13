import axios from "axios";

const FollowButton = ({ userId }) => {

  const handleFollow = async () => {
    try {
      const token = JSON.parse(
        localStorage.getItem("userInfo")
      ).token;

      await axios.put(
        `/api/users/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Action completed");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleFollow}>
      Follow
    </button>
  );
};

export default FollowButton;
