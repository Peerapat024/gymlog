export interface VolumeComparison {
  name: string;
  weight: number;
  phrases: string[];
}

export const VOLUME_COMPARISONS: VolumeComparison[] = [
  // Tier 1: 500-2,000 kg
  { name: 'Grand Piano', weight: 500, phrases: ['You just tossed a concert hall\'s worth of music around.', 'Beethoven would be impressed by that kind of carry.', 'That\'s a lot of weight for one symphony.'] },
  { name: 'Polar Bear', weight: 600, phrases: ['You just wrestled the king of the Arctic.', 'Apex predator weight? Handled with ease.', 'The ice is shivering after that performance.'] },
  { name: 'Smart Car', weight: 700, phrases: ['You basically just parallel parked a car... with your bare hands.', 'Fuel efficient? No. Muscle efficient? Yes.', 'Who needs a tow truck when you\'re hitting the gym?'] },
  { name: 'Holstein Cow', weight: 750, phrases: ['That\'s a \'moo-ving\' amount of weight.', 'You\'re officially stronger than a farmhand.', 'Outstanding in your field—literally.'] },
  { name: 'VW Beetle', weight: 800, phrases: ['Old school cool, and apparently, you can lift it.', 'You just bench-pressed a 1960s classic.', 'Herbie the Love Bug has nothing on your gains.'] },
  { name: 'Saltwater Crocodile', weight: 1000, phrases: ['You effectively wrestled the world\'s largest reptile.', 'Snap! That\'s a prehistoric amount of volume.', 'Crikey! You\'re stronger than a Jurassic survivor.'] },
  { name: 'Liberty Bell', weight: 940, phrases: ['Let freedom ring... and your muscles burn.', 'A historic lift for a historic session.', 'You\'ve got enough power to start a revolution.'] },
  { name: 'Giraffe', weight: 1200, phrases: ['Reaching new heights with that volume.', 'That\'s a tall order, and you delivered.', 'Stretching your limits like a long-neck legend.'] },
  { name: 'Server Rack', weight: 1500, phrases: ['You just lifted the entire internet\'s weight.', 'That\'s a lot of data—and a lot of gains.', 'System update: You are now officially Jacked.'] },
  { name: 'Great White Shark', weight: 2000, phrases: ['You\'re the apex predator of this gym.', 'Jaws would be terrified of those reps.', 'Fin-ishing the workout like a total boss.'] },

  // Tier 2: 2,200-3,800 kg
  { name: 'White Rhino', weight: 2300, phrases: ['Charging through your sets like a beast.', 'A rare lift for a rare athlete.', 'That\'s some thick-skinned strength right there.'] },
  { name: 'Shipping Container', weight: 2200, phrases: ['You\'ve got enough volume to start an export business.', 'Logistics just got personal. You\'re the crane now.', 'Packed, stacked, and lifted.'] },
  { name: 'The Iron Throne', weight: 2500, phrases: ['You\'re officially ruling the Seven Gym-doms.', 'Winter is coming, but you\'ve got the heat.', 'A king-sized lift for the rightful heir.'] },
  { name: 'Blue Whale Tongue', weight: 2700, phrases: ['That is a \'whale\' of a workout.', 'You just lifted a literal mouthful of muscle.', 'Diving deep into the heavy sets today.'] },
  { name: 'Hippopotamus', weight: 3000, phrases: ['You lifted the weight of nature\'s crankiest tank.', 'Hungry, hungry for more reps!', 'That\'s some heavy-duty river-horse power.'] },
  { name: 'Hummer H1', weight: 3500, phrases: ['Off-road power meets gym-floor grind.', 'You\'re built like a tactical vehicle.', 'No paved roads needed for those gains.'] },
  { name: 'Beer Kegs (60 units)', weight: 3700, phrases: ['That\'s one heck of a party you just lifted.', 'Cheers to those heavy sets!', 'You\'re doing the heavy lifting for the whole pub.'] },
  { name: 'Ford F-450', weight: 3800, phrases: ['Built tough, but you\'re clearly built tougher.', 'You\'ve got more towing capacity than a dually.', 'Heavy duty is your middle name.'] },

  // Tier 3: 4,300-15,000 kg
  { name: 'Huey Helicopter', weight: 4300, phrases: ['Taking your fitness to a higher altitude.', 'Get to the chopper? You ARE the chopper.', 'Your volume just took flight.'] },
  { name: 'African Elephant', weight: 6500, phrases: ['The largest land animal is no match for you.', 'You\'re the heavyweight champion of the Savannah.', 'A monumental lift for a monumental human.'] },
  { name: 'Giant Squid', weight: 7000, phrases: ['Release the Kraken-sized strength!', 'Tenacious reps from a deep-sea legend.', 'That\'s a lot of arms... and a lot of weight.'] },
  { name: 'T-Rex', weight: 8000, phrases: ['You just bench-pressed the King of Dinosaurs.', 'Extinction-level strength on display.', 'Life finds a way... to get jacked.'] },
  { name: 'Cruise Ship Anchor', weight: 10000, phrases: ['You\'re officially heavy enough to keep a ship in place.', 'Don\'t let the weight drag you down.', 'Anchors aweigh! That\'s a massive set.'] },
  { name: 'Hubble Telescope', weight: 11000, phrases: ['Your workout is visible from deep space.', 'Focusing on those stellar gains.', 'A universal level of effort today.'] },
  { name: 'Double-Decker Bus', weight: 12000, phrases: ['You moved a commute\'s worth of steel and glass.', 'Mind the gap—between you and everyone else.', 'Top deck or bottom deck, it\'s all gains.'] },
  { name: '20 Grizzly Bears', weight: 12000, phrases: ['That\'s a bear-y impressive amount of weight.', 'Hibernation is over; the beast is awake.', 'You\'re officially the boss of the forest.'] },
  { name: 'School Bus', weight: 13000, phrases: ['You just took the whole class to school.', 'The wheels on the bus go... up and down.', 'That\'s some heavy-duty homework.'] },
  { name: 'Tokyo Subway Car', weight: 14000, phrases: ['Commuter-level volume handled with ease.', 'You\'re running on a high-speed rail today.', 'Direct line to Gains Station.'] },
  { name: 'Fire Truck', weight: 15000, phrases: ['Extinguishing the competition with that volume.', 'You\'re bringing the heat and the heavy lifting.', 'Sound the alarm, there\'s a beast in the gym.'] },

  // Tier 4: 22,000+ kg
  { name: 'Chinook Helicopter', weight: 22000, phrases: ['Dual-rotor power in every rep.', 'You\'re lifting the heavy-lift specialist.', 'Gravity is just a suggestion to you.'] },
  { name: 'Space Shuttle Booster', weight: 28000, phrases: ['Your workout had enough mass to reach orbit.', 'To infinity and beyond... the squat rack.', 'A truly astronomical performance.'] },
  { name: 'Humpback Whale', weight: 30000, phrases: ['Singing a song of pure strength.', 'A breach-worthy performance today.', 'Massive volume from the ocean\'s acrobat.'] },
  { name: 'Gray Whale', weight: 35000, phrases: ['You just moved a deep-sea giant.', 'A migratory level of effort today.', 'Making a massive splash in the gym.'] },
  { name: 'Semi-Truck', weight: 36000, phrases: ['Keep on truckin\' with that massive volume.', 'You\'ve got 18-wheeler levels of torque.', 'Hauling the heavy stuff like a pro.'] },
  { name: 'Luxury Yacht', weight: 40000, phrases: ['You\'re lifting in the \'Tax Haven\' weight class now.', 'Smooth sailing through those heavy sets.', 'First-class gains for a first-class lifter.'] },
  { name: 'Boeing 737 (Empty)', weight: 41000, phrases: ['Your workout just cleared for takeoff.', 'That\'s enough volume to cross a continent.', 'The sky isn\'t the limit; it\'s your playground.'] },
  { name: 'Orca Pod (5 Orcas)', weight: 45000, phrases: ['A killer workout for a killer athlete.', 'You\'re the top of the food chain today.', 'Working together... wait, that was all you!'] },
  { name: 'Megalodon', weight: 48000, phrases: ['You just lifted a legend of the deep.', 'Prehistoric power in a modern-day gym.', 'A bite-sized challenge for a giant like you.'] },
  { name: 'Blue Whale', weight: 150000, phrases: ['The biggest animal ever? You just lifted it.', 'Earth has never seen gains like this.', 'You\'re basically a force of nature now.'] },
];

export function getVolumeComparison(totalVolume: number): { object: VolumeComparison; phrase: string } | null {
  // Find the object with weight <= totalVolume, closest match
  let bestMatch: VolumeComparison | null = null;
  for (const obj of VOLUME_COMPARISONS) {
    if (obj.weight <= totalVolume) {
      if (!bestMatch || obj.weight > bestMatch.weight) {
        bestMatch = obj;
      }
    }
  }
  
  if (!bestMatch) return null;
  
  // Pick a random phrase
  const phrase = bestMatch.phrases[Math.floor(Math.random() * bestMatch.phrases.length)];
  return { object: bestMatch, phrase };
}
