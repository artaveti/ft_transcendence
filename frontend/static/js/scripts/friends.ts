import { BASE_URL, navigateTo } from "../index.js";
import { updateTextForElem } from "../utils/languages.js";
import { isUserConnected } from "../utils/utils.js";
import { authFetch } from "../utils/authFetch.js";

interface User {
  username: string;
  profile_picture: string;
}

interface Friend extends User {
  online_status: boolean;
}

// Function that will be called when the view is loaded
export async function friends(): Promise<void> {
  if (!(await isUserConnected())) {
    navigateTo('/signin');
    return;
  }

  // Get the container that contains all the individual user containers
  const userElementsContainer = document.getElementById('user-elements') as HTMLElement | null;
  const friendElementsContainer = document.getElementById('friend-elements') as HTMLElement | null;

  if (!userElementsContainer || !friendElementsContainer) {
    console.error("Required container elements not found.");
    return;
  }

  const fillUsersContainter = async () => {
    // Get the current user's username
    const responseProfile = await authFetch(`${BASE_URL}/api/profile`);
    if (responseProfile.status === 200) {
      const responseData = await responseProfile.json();
      const user = responseData.user;
      const current_username = user.username;

      // Get the list of all users
      const responseUsers = await authFetch(`${BASE_URL}/api/users_list`);
      if (responseUsers.status === 200) {
        const users: User[] = await responseUsers.json();

        // If the user list is empty
       if (users.length === 1) {
          userElementsContainer.innerHTML = `<div id="user-error" class="text-white" data-translate="no users"></div>`;
          
          // ✅ Added null check and safe cast
          const errorElem = document.getElementById('user-error');
          if (errorElem) {
            updateTextForElem(errorElem, 'no users');
          }
          return;
        }

        // Empty the container
        userElementsContainer.innerHTML = '';

        users.forEach(async (user: User) => {
          // Check that the user is not the current user
          if (user.username === current_username) {
            return;
          }

          // Check that the user is not already a friend
          const responseFriends = await authFetch(`${BASE_URL}/api/friends_list`);
          const friendList: Friend[] = await responseFriends.json();
          if (friendList.find(friend => friend.username === user.username)) {
            return;
          }

          // Event Listener to add a friend
          const addFriend = async () => {
            const response = await authFetch(`${BASE_URL}/api/add_friend`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: user.username
              })
            });
            if (!response.ok) {
              console.log("Couldn't send a friend request.");
            }
            await fillUsersContainter();
            await fillFriendsContainter();
          };

          // Create the user element
          const userDiv = document.createElement('div');
          userDiv.className = 'd-flex align-items-center';

          // Create the profile picture img element
          const profilePic = document.createElement('img');
          profilePic.src = user.profile_picture || 'static/assets/images/default.jpg';
          profilePic.alt = 'profile picture';
          profilePic.className = 'profile-pic-list';
          profilePic.id = 'avatar';

          // Create the user name paragraph element
          const userName = document.createElement('p');
          userName.className = 'm-0 ms-2';
          userName.textContent = user.username;

          // Append the profile picture and username
          userDiv.appendChild(profilePic);
          userDiv.appendChild(userName);

          // Create the plus icon img element
          const plusIcon = document.createElement('img');
          plusIcon.src = 'static/assets/UI/icons/plus.svg';
          plusIcon.alt = 'plus icon';
          plusIcon.className = 'plus-icon-list me-1';
          plusIcon.addEventListener('click', () => {
            addFriend();
          });

          // Append the plus icon to the main user element
          const userElement = document.createElement('div');
          userElement.className = 'd-flex justify-content-between align-items-center user-element tabbable';
          userElement.appendChild(userDiv);
          userElement.appendChild(plusIcon);

          // Make the div tabbable
          userElement.tabIndex = 0;

          userElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              addFriend();
            }
          });

          // Append the whole user element to the user-elements container
          userElementsContainer.appendChild(userElement);
        });
      }
    } else {
      navigateTo('/signin');
    }
  };

  // Get the list of all friends
  const fillFriendsContainter = async () => {
    const responseFriends = await authFetch(`${BASE_URL}/api/friends_list`);
    if (responseFriends.status === 200) {
      const friends: Friend[] = await responseFriends.json();

 
if (friends.length === 0) {
        friendElementsContainer.innerHTML = `<div class="text-white friend-error" data-translate="no friends"></div>`;
        
        const friendErrorElem = document.querySelector('.friend-error') as HTMLElement | null;
        if (friendErrorElem) {
          updateTextForElem(friendErrorElem, 'no friends');
        }
        return;
      }
      friendElementsContainer.innerHTML = '';

      friends.forEach(async (friend: Friend) => {
        // Event Listener to remove a friend
        const removeFriend = async () => {
          const response = await authFetch(`${BASE_URL}/api/remove_friend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: friend.username
            })
          });
          if (!response.ok) {
            console.log("Couldn't send a friend removal request.");
          }
          await fillUsersContainter();
          await fillFriendsContainter();
        };

        // Create the friend element
        const friendDiv = document.createElement('div');
        friendDiv.className = 'd-flex align-items-center';

        // Profile picture
        const profilePic = document.createElement('img');
        profilePic.src = friend.profile_picture || 'static/assets/images/default.jpg';
        profilePic.alt = 'profile picture';
        profilePic.className = 'profile-pic-list';

        // Online status
        const onlineStatus = document.createElement('img');
        onlineStatus.src = friend.online_status
          ? 'static/assets/UI/icons/connected.svg'
          : 'static/assets/UI/icons/disconnected.svg';
        onlineStatus.alt = 'online status';
        onlineStatus.className = 'online-icon-list ms-2';

        // Username


        const userName = document.createElement('p');
        userName.className = 'm-0 ms-2';
        userName.textContent = friend.username;

        friendDiv.append(profilePic, userName, onlineStatus);

        // Remove friend button
        const minusIcon = document.createElement('img');
        minusIcon.src = 'static/assets/UI/icons/minus.svg';
        minusIcon.alt = 'minus icon';
        minusIcon.className = 'minus-icon-list me-1';
        minusIcon.addEventListener('click', removeFriend);

        // Append to container
        const friendElement = document.createElement('div');
        friendElement.className = 'd-flex justify-content-between align-items-center friend-element tabbable';
        friendElement.append(friendDiv, minusIcon);

        // Keyboard support
        friendElement.tabIndex = 0;
        friendElement.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter') removeFriend();
        });

        friendElementsContainer.appendChild(friendElement);
      });
    }
  };
  await fillUsersContainter();
  await fillFriendsContainter();
}
