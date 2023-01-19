import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { IHeroById } from './interfaces/hero.interface';
import { IHero } from './interfaces/hero-by-id.interface';

interface HeroService {
  findOne(data: IHeroById): Observable<IHero>;
  findMany(upstream: Observable<IHeroById>): Observable<IHero>;
}

@Controller('hero')
export class HeroController implements OnModuleInit {
  private readonly items: IHero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private heroService: HeroService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @Get()
  getMany(): Observable<IHero[]> {
    const ids$ = new ReplaySubject<IHeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.heroService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<IHero> {
    return this.heroService.findOne({ id: +id });
  }

  @GrpcMethod('HeroService')
  findOne(data: IHeroById): IHero {
    return this.items.find(({ id }) => id === data.id);
  }

  @GrpcStreamMethod('HeroService')
  findMany(data$: Observable<IHeroById>): Observable<IHero> {
    const hero$ = new Subject<IHero>();

    const onNext = (heroById: IHeroById) => {
      const item = this.items.find(({ id }) => id === heroById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }
}
