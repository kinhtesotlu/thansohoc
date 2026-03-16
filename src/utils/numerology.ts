/**
 * Pythagorean Numerology Logic
 */

export const pythagoreanMap: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

export function reduceToMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  
  const sum = String(num)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
    
  return reduceToMaster(sum);
}

export function calculateLifePath(dob: string): number {
  // dob format: YYYY-MM-DD
  const parts = dob.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const rYear = reduceToMaster(year);
  const rMonth = reduceToMaster(month);
  const rDay = reduceToMaster(day);

  return reduceToMaster(rYear + rMonth + rDay);
}

export function calculateNameNumbers(fullName: string) {
  const words = fullName.toLowerCase().split(/\s+/);
  const standardVowels = ['a', 'e', 'i', 'o', 'u'];
  
  let expressionSum = 0;
  let soulUrgeSum = 0;
  let personalitySum = 0;
  const nameCounts: Record<number, number> = {};

  words.forEach(word => {
    const chars = word.split('').filter(c => pythagoreanMap[c]);
    chars.forEach((char, index) => {
      const val = pythagoreanMap[char];
      expressionSum += val;
      
      // Name Chart counts
      nameCounts[val] = (nameCounts[val] || 0) + 1;

      // Determine if 'y' is a vowel or consonant
      let isVowel = standardVowels.includes(char);
      if (char === 'y') {
        const prevChar = index > 0 ? chars[index - 1] : null;
        const nextChar = index < chars.length - 1 ? chars[index + 1] : null;
        
        const hasAdjacentVowel = (prevChar && standardVowels.includes(prevChar)) || 
                                (nextChar && standardVowels.includes(nextChar));
        
        // In Vietnamese: 'y' is a vowel if no other vowels are adjacent
        isVowel = !hasAdjacentVowel;
      }

      if (isVowel) {
        soulUrgeSum += val;
      } else {
        personalitySum += val;
      }
    });
  });

  return {
    expression: reduceToMaster(expressionSum),
    soulUrge: reduceToMaster(soulUrgeSum),
    personality: reduceToMaster(personalitySum),
    nameCounts
  };
}

export function calculateBirthChart(dob: string) {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  const counts: Record<number, number> = {};
  digits.forEach(d => {
    if (d > 0) counts[d] = (counts[d] || 0) + 1;
  });
  return counts;
}

export function calculatePersonalYear(dob: string, targetYear: number): number {
  const parts = dob.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const rDay = reduceToMaster(day);
  const rMonth = reduceToMaster(month);
  const rYear = reduceToMaster(targetYear);

  return reduceToMaster(rDay + rMonth + rYear);
}

export function calculatePinnacles(dob: string, lifePath: number) {
  const parts = dob.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const rYear = reduceToMaster(year);
  const rMonth = reduceToMaster(month);
  const rDay = reduceToMaster(day);

  const p1 = reduceToMaster(rDay + rMonth);
  const p2 = reduceToMaster(rDay + rYear);
  const p3 = reduceToMaster(p1 + p2);
  const p4 = reduceToMaster(rMonth + rYear);

  const age1 = 36 - (lifePath > 11 ? reduceToMaster(lifePath) : lifePath);
  const age2 = age1 + 9;
  const age3 = age2 + 9;

  return [
    { level: 1, value: p1, age: `0 - ${age1}` },
    { level: 2, value: p2, age: `${age1 + 1} - ${age2}` },
    { level: 3, value: p3, age: `${age2 + 1} - ${age3}` },
    { level: 4, value: p4, age: `${age3 + 1}+` },
  ];
}

export function calculateChallenges(dob: string) {
  const parts = dob.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const rYear = reduceToMaster(year) > 9 ? reduceToMaster(reduceToMaster(year)) : reduceToMaster(year);
  const rMonth = reduceToMaster(month) > 9 ? reduceToMaster(reduceToMaster(month)) : reduceToMaster(month);
  const rDay = reduceToMaster(day) > 9 ? reduceToMaster(reduceToMaster(day)) : reduceToMaster(day);

  const c1 = Math.abs(rMonth - rDay);
  const c2 = Math.abs(rDay - rYear);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rMonth - rYear);

  return [
    { level: 1, value: c1 },
    { level: 2, value: c2 },
    { level: 3, value: c3 },
    { level: 4, value: c4 },
  ];
}
