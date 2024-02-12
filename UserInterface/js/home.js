import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();
const room_grid = document.getElementById('room-grid');
const main = document.createElement('main');
room_grid.append(main);

function hideSettings() {
  const jwt = Utils.getJwt();
  const token = Utils.parseJwt(JSON.stringify(jwt));

  const settingsDropstart = document.getElementById('settings-dropstart');
  if (token['admin']) {
    settingsDropstart.style.visibility = "visible";
  }else{
    settingsDropstart.style.visibility = "hidden";
  }
}

hideSettings();

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', Utils.logout);

function resetRoomsList() {
  while(main.firstChild) {
    main.removeChild(main.lastChild);
  }
}

export async function renderRoomCards() {
  resetRoomsList();

  const rooms = await proxy.getRooms();
  // console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  if (rooms.length) {
    rooms.forEach(room => {
      const card = document.createElement('div');
      const card_header = document.createElement('div');
      const card_body = document.createElement('div');    // Needs to containt multiple rows
      const roomName = document.createElement('h1');
      
      card.setAttribute('class', 'room-card');
      card.setAttribute('id', `${room['id']}`)
      card_header.setAttribute('class', 'card-header');
      card_body.setAttribute('class', 'row');
      roomName.setAttribute('class', 'display-3')
      roomName.textContent = room["name"];

      if (room['measurements'].length) {
        // Need a label, value, and row for each
        const t_row = document.createElement('div');
        const t_label = document.createElement('p');
        const t_value = document.createElement('p');
        const h_row = document.createElement('div');
        const h_label = document.createElement('p');
        const h_value = document.createElement('p');
        const p_row = document.createElement('div');
        const p_label = document.createElement('p');
        const p_value = document.createElement('p');
        const l_row = document.createElement('div');
        const l_label = document.createElement('p');
        const l_value = document.createElement('p');

        t_row.setAttribute('class', 'd-flex justify-content-between');
        t_label.setAttribute('class', 'h1');
        t_label.textContent = "Temperature:";
        t_value.setAttribute('class', 'h1');
        t_value.textContent = `${room['measurements'][room['measurements'].length-1]['temperature']}`;
        h_row.setAttribute('class', 'd-flex justify-content-between');
        h_label.setAttribute('class', 'h1');
        h_label.textContent = "Humidity:";
        h_value.setAttribute('class', 'h1');
        h_value.textContent = `${room['measurements'][room['measurements'].length-1]['humidity']}`;
        p_row.setAttribute('class', 'd-flex justify-content-between');
        p_label.setAttribute('class', 'h1');
        p_label.textContent = "Pressure:";
        p_value.setAttribute('class', 'h1');
        p_value.textContent = `${room['measurements'][room['measurements'].length-1]['pressure']}`;
        l_label.setAttribute('class', 'h1');
        l_label.textContent = "Light:";
        l_row.setAttribute('class', 'd-flex justify-content-between');
        l_value.setAttribute('class', 'h1');
        l_value.textContent = `${room['measurements'][room['measurements'].length-1]['light']}`;

        t_row.append(t_label);
        t_row.append(t_value);
        h_row.append(h_label);
        h_row.append(h_value);
        p_row.append(p_label);
        p_row.append(p_value);
        l_row.append(l_label);
        l_row.append(l_value);
        card_body.append(t_row);
        card_body.append(h_row);
        card_body.append(p_row);
        card_body.append(l_row);
      }else{
        const emptyMeasurementsText = document.createElement('div');
        emptyMeasurementsText.textContent = "No Data Available";
        emptyMeasurementsText.setAttribute('style', 'color: grey');

        card_body.append(emptyMeasurementsText);
      }

      if (room['actions'].length) {
        // Need a label, value, and row for each
        const vent_row = document.createElement('div');
        const vent_label = document.createElement('p');
        const vent_value = document.createElement('p');
        const shade_row = document.createElement('div');
        const shade_label = document.createElement('p');
        const shade_value = document.createElement('p');
        

        vent_row.setAttribute('class', 'd-flex justify-content-between');
        vent_label.setAttribute('class', 'h2');
        vent_label.setAttribute('style', 'color: red');
        vent_label.textContent = "Vent State:";
        vent_value.setAttribute('class', 'h2');
        vent_value.setAttribute('style', 'color: red');
        vent_value.textContent = `${room['actions'][room['actions'].length-1]['vent_state']}`;
        shade_row.setAttribute('class', 'd-flex justify-content-between');
        shade_label.setAttribute('class', 'h2');
        shade_label.setAttribute('style', 'color: red');
        shade_label.textContent = "Shade State:";
        shade_value.setAttribute('class', 'h2');
        shade_value.setAttribute('style', 'color: red');
        shade_value.textContent = `${room['actions'][room['actions'].length-1]['shade_state']}`;
        

        vent_row.append(vent_label);
        vent_row.append(vent_value);
        shade_row.append(shade_label);
        shade_row.append(shade_value);
      
        card_body.append(vent_row);
        card_body.append(shade_row);
      
      }else{
        const emptyActionsText = document.createElement('div');
        emptyActionsText.textContent = "No Actions Available";
        emptyActionsText.setAttribute('style', 'color: grey');

        card_body.append(emptyActionsText);
      }
  
      
      card_header.append(roomName);
      card.append(card_header);
      card.append(card_body);
      main.append(card);
    
      card.addEventListener('click', () => {
        // console.log(card.getAttribute('id'));
        sessionStorage.setItem('roomID', room['id']);
        window.location.href = `/home/room/${room['id']}`;
      });
    });
  }else{
    const noRoomsText = document.createElement('div');
    noRoomsText.setAttribute('class', '');
    noRoomsText.textContent = "There are currently no rooms. Create a room to have it be displayed here.";
    main.append(noRoomsText);
  }

  

  // displayNewRoomCard(main);
}

function renderNewRoomCard() {
  const body = document.body;
  const main = document.createElement('main');
  body.append(main);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  // Create an array to keep track of references for each card created

  const card = document.createElement('div');
  // const plusIcon = document.createElement('img');
  // const title = document.createElement('h2');
  const button = document.createElement('button');
  button.setAttribute('class', 'modal-trigger');
  card.setAttribute('class', 'plus-card');
  // plusIcon.setAttribute('src', 'images/plus.png');
  // plusIcon.setAttribute('width', '50px');
  // title.textContent = "add new room";
  button.textContent = "create room";

  // card.append(plusIcon);
  card.append(button);
  main.append(card);
}

renderRoomCards();
// renderNewRoomCard();