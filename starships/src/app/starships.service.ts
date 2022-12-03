
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, map, of, tap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarshipsService {
  private readonly rootURL = 'https://swapi.dev/api/people/';

  ships$ = (person: Person) =>
    of(person.starships).pipe(
      // Since i is an array each item will be returned to the next function
      concatMap((i: string[]) => i),
      // i is now a string from the previous function
      concatMap((i) => this.http.get(i)),
      // Once all urls complete convert the result back to an array
      toArray<Starship>(),
      // Replace the string version of the array with the object version
      tap((i) => (person.starships = i)),
      // Pass person on to the next function
      map(() => person)
    );

  people$ = (people: Person[]) =>
    of(people).pipe(
      // Read each array item as a string and pass it to the next function
      concatMap((i) => i),
      // i is now a Person object we will pass it to ships
      concatMap((i) => this.ships$(i)),
      // convert the results back to an array
      toArray()
    );

  data = new BehaviorSubject<string>(this.rootURL);
  data$ = this.data.pipe(
    // Process the value of the behavior subject
    concatMap((url) => this.http.get<Results>(url)),
    concatMap((result) =>
      // Send the results to the people func for processing
      this.people$(result.results).pipe(
        // Map back to the original with strings replace by objects
        map<any, Results<Starship>>(() => <Results<Starship>>result)
      )
    )
  );

  constructor(private http: HttpClient) { }

  go(url?: string) {
    // This will trigger the `data` pipe to run again
    this.data.next(url || this.rootURL);
  }
}


interface Results<T = string | Starship> {
  next: string;
  previous: string;
  results: Person<T>[];
}

interface Person<T = string | Starship> {
  name: string;
  starships: T[];
}

interface Starship {
  name: string;
}

