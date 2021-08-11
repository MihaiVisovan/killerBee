const beesType = [
  { type: 'queen', hp: 100, number: 1, damage: 8},
  { type: 'worker', hp: 75, number: 5, damage: 10},
  { type: 'drone', hp: 50, number: 8, damage: 12},
];

let bees = [];
let numberOfBees = 0;
let swarmHealth = 0;
let damage = 0;
let beeType = '';

// refresh data from local storage
const getData = () => {
  bees = JSON.parse(localStorage.getItem('bees'));
  numberOfBees = JSON.parse(localStorage.getItem('numberOfBees'));
  swarmHealth = JSON.parse(localStorage.getItem('swarmHealth'));
  damage = JSON.parse(localStorage.getItem('damage'));
  beeType = JSON.parse(localStorage.getItem('beeType'));
};

const updateLocalStorage = (bees, numberOfBees, swarmHealth, damage, beeType) => {
  localStorage.setItem('bees', JSON.stringify(bees));
  localStorage.setItem('numberOfBees', JSON.stringify(numberOfBees));
  localStorage.setItem('swarmHealth', JSON.stringify(swarmHealth));
  localStorage.setItem('damage', JSON.stringify(damage));
  localStorage.setItem('beeType', JSON.stringify(beeType));
  getData();
};

const showBeesData = () => {
  const beeDiv = document.querySelector('.bees');
  const swarmDiv = document.getElementsByClassName('swarm')[0];
  swarmDiv.textContent = `Swarm Health: ${swarmHealth}`;

  // add bees data on the UI
  bees.forEach(bee => {
    const div = document.createElement('div');
    div.textContent = `Bee ${bee.id} - ${bee.type} - HP: ${bee.hp}`;
    div.id = bee.id;
    beeDiv.appendChild(div);
  });
};

const skipMainPage = (name) => {
  document.getElementsByClassName('game-page')[0].style.display = 'block';
  document.getElementsByClassName('main-page')[0].style.display = 'none';
  document.getElementsByClassName('name')[0].innerHTML = `Hey ${name}, `;
};

const initLocalStorage = () => {
  let beesInitialData = [];
 
  // create bees list
  beesType.forEach(beeType => {
    const { number, type, hp } = beeType;

    for (i = 0; i < number; i++) {
      beesInitialData.push({
        type,
        hp,
      });
    };
  });

  // add index as identifier
  beesInitialData = beesInitialData.map((bee, index)=> {
    return { 
      ...bee,
      id: index,
    };
  });

  // calculate initial number of bees and initial swarm health
  const numberOfBees = beesType.map(bee => bee.number).reduce((x,y) => x + y);
  const swarmHealth = beesInitialData.map(bee => bee.hp).reduce((x,y) => x + y);

  updateLocalStorage(beesInitialData, numberOfBees, swarmHealth, damage, beeType);
};

window.onload = () => {
  getData();
  const name = localStorage.getItem('name');
  
  // if name exists in local storage, skip the main page
  if (name) { 
    skipMainPage(name);
  }

  // if bees don't exist in local storage, set it with initial data
  if (!bees?.length) {
    initLocalStorage();
  }
  else {
    showBeesData();
  }
};

const updateGeneralInfo = (damage, type) => {
  const swarmDiv = document.getElementsByClassName('swarm')[0];
  const damageDiv = document.getElementsByClassName('damage')[0];
  const beeTypeDiv = document.getElementsByClassName('bee-type')[0];

  swarmDiv.textContent = `Swarm Health: ${swarmHealth}`;
  damageDiv.textContent = ` - Damage dealt: ${damage}`;
  beeTypeDiv.textContent = ` - Bee type: ${type}`;
};

const killAllBees = (bee) => {
  const beeDiv = document.getElementById(bee.id);
  const beeText = beeDiv.textContent;
  beeDiv.textContent = beeText.replace(beeText.split('-')[2], ` dead`);
  beeDiv.textContent = beeDiv.textContent.replace(beeText.split('-')[2], ``);
  const swarmDiv = document.getElementsByClassName('swarm')[0];
  swarmDiv.textContent = `Swarm Health: 0`;
};

const damageBees = () => {
  // get a random bee
  const randomBeeIndex = Math.floor(Math.random(0, numberOfBees) * numberOfBees);
  const randomBee = bees[randomBeeIndex];

  // get the damage for that bee type
  const damage = beesType.find(bee => bee.type === randomBee.type).damage;
  const negativeValue = randomBee.hp;
  randomBee.hp -= damage;

  const randomBeeDiv = document.getElementById(randomBee.id);
  const randomBeeText = randomBeeDiv.textContent;

  // update hp for random bee
  if (randomBee.hp <= 0) {
    bees = bees.filter(bee => bee !== randomBee);
    numberOfBees--;

    randomBeeDiv.textContent = randomBeeText.replace(randomBeeText.split('-')[2], ` dead`);
    randomBeeDiv.textContent = randomBeeDiv.textContent.replace(randomBeeText.split(',')[2], ``);

    // if hp goes under 0, subtract only the initial value
    swarmHealth -= negativeValue;
  } else {

    // update swarm health
    swarmHealth -= damage;
    randomBeeDiv.textContent = randomBeeText.replace(randomBeeText.split('-')[2], ` HP: ${randomBee.hp}`);
  }

  updateGeneralInfo(damage, randomBee.type);

  // end game
  if(numberOfBees === 0 || (randomBee.hp <= 0 && randomBee.type === 'queen')) {
    bees.forEach(bee => {
      killAllBees(bee);
    });
    
    // set initial data
    initLocalStorage();

    document.getElementsByClassName('logo')[0].textContent = 'Game Over!';
    document.body.style.pointerEvents = 'none';

    setTimeout(() => {
      window.location.reload();
    }, 3000);
    return;
  };

  updateLocalStorage(bees, numberOfBees, swarmHealth, damage, beeType);
};

const submitName = (event) => {
  event.preventDefault();

  const name = document.getElementById('input').value;
  localStorage.setItem('name', name);

  document.getElementsByClassName('main-page')[0].style.display = 'none';
  document.getElementsByClassName('game-page')[0].style.display = 'block';
  document.getElementsByClassName('name')[0].innerHTML = `Hey ${name}, `;

  initLocalStorage();
  showBeesData();
};




