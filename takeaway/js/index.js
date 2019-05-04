// WIP

'use strict';

import {
  getPlaceStatus,
  // getRandomInt,
  html,
  // isStringNumber,
  // JSONbin,
  randomizeArray,
  // shuffleArray,
  // xEl,
  // xStyleSheet,
} from 'https://jsejcksn.github.io/js-modules/dist/bundles/bundle-1.1.1.js';

function createEntry (place) {
  const status = getPlaceStatus(place);

  function getTimeString () {
    if (status.open) {
      if (status.for < 60) {
        return `Closes in ${status.for} min (${status.next.time.slice(0, 2)}:${status.next.time.slice(2, 4)})`;
      }
      else return `Open until ${status.next.time.slice(0, 2)}:${status.next.time.slice(2, 4)}`;
    }
    else return '';
  }

  const li = html('li', {class: 'place'},
    html('h2', {class: 'name'}, place.name),
    html('div', {class: 'status'},
      html('p', {class: 'time'}, getTimeString()),
      html('p', {class: 'action collapsed'}, 'View more details'),
    ),
    html('div', {class: 'contact collapsed'},
      html('a', {class: 'address', href: place.url}, place.formatted_address),
      html('a', {class: 'phone', href: `tel:${place.international_phone_number.split(' ').join('').split('-').join('')}`}, place.international_phone_number),
    ),
  );

  if (!status.open) {
    li.setAttribute('hidden', '');
  }

  if (status.open) {
    if (status.for < 60) {
      if (status.for < 30) {
        li.querySelector('.time').style.setProperty('color', 'var(--very-soon)');
      }
      else {
        li.querySelector('.time').style.setProperty('color', 'var(--soon)');
      }
    }
    else {
      li.querySelector('.time').style.setProperty('color', 'var(--later)');
    }
  }

  return li;
}

async function main () {
  try {
    const res = await fetch('./places.json');
    const places = await res.json();

    const list = places.results;

    document.body.appendChild(
      html('h1', null, 'Available takeaway')
    );

    const ul = document.body.appendChild(
      html('ul', {class: 'list'})
    );

    randomizeArray(list);
    for (const place of list) {
      ul.appendChild(createEntry(place));
    }

    ul.addEventListener('click', ev => {
      if (
        ev.target.closest('.place')
        && !ev.target.matches('a')
      ) {
        ev.target.closest('.place').querySelector('.contact').classList.toggle('collapsed');
      }
    });

    const date = new Date(places.timestamp);
    const dateNames = {
      days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };

    const updated = document.body.appendChild(
      html('div', {class: 'updated'}, `Place information updated at ${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')} on ${date.getDate()} ${dateNames.months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`)
    );

    if (
      document.querySelectorAll('.place[hidden]').length ===
      document.querySelectorAll('.place').length
    ) {
      updated.setAttribute('hidden', '');

      document.body.appendChild(
        html('h2', {class: 'unavailable'}, 'Nothing is available right now.')
      );
    }
  }
  catch (err) {
    throw err;
  }
}

main();
