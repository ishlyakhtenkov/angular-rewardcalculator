export class StringUtil {
    
    static UpperCaseFirstLettersOfWords(line: string): string {
        line = line.toLowerCase();
        let words = line.split(' ');
        line = '';
        for (let word of words) {
        let lowerCaseLetters = word.substring(1);
        let upperCaseLetter = word.charAt(0).toUpperCase();
        line = line.concat(upperCaseLetter, lowerCaseLetters, ' ');
        }
        return line.trim();
    }
}
