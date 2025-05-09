class NewUserDto {
  public id: string;
  username: string;
  age: number;
  hobbies: string[];


  // TODO: add validation here?
  constructor({ id, username, age, hobbies }: { id: string; username: string; age: number; hobbies: string[] }) {
    this.id = id;
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
}