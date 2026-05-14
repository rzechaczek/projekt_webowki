import {
    Injectable,
    OnApplicationBootstrap,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../recipes/entities/recipe.entity';
import { RecipeIngredient } from '../recipes/entities/recipe-ingredient.entity';
import { RecipeStep } from '../recipes/entities/recipe-step.entity';
import { Tag } from '../recipes/entities/tag.entity';

interface SeedIngredient {
    name: string;
    amount: number;
    unit: string;
    note?: string;
}

interface SeedStep {
    stepNumber: number;
    description: string;
}

interface SeedRecipe {
    title: string;
    description: string;
    baseServings: number;
    servingUnit: string;
    prepTimeMin: number;
    cookTimeMin: number;
    tags: string[];
    ingredients: SeedIngredient[];
    steps: SeedStep[];
}

const SEED_RECIPES: SeedRecipe[] = [
    {
        title: 'Naleśniki',
        description:
            'Klasyczne polskie naleśniki – cienkie, delikatne i wszechstronne. Podawaj z dżemem, twarogiem lub owocami.',
        baseServings: 10,
        servingUnit: 'naleśniki',
        prepTimeMin: 10,
        cookTimeMin: 20,
        tags: ['śniadanie', 'deser'],
        ingredients: [
            { name: 'Mąka pszenna', amount: 250, unit: 'g' },
            { name: 'Mleko', amount: 500, unit: 'ml' },
            { name: 'Jajka', amount: 2, unit: 'szt.' },
            { name: 'Masło', amount: 30, unit: 'g', note: 'roztopione' },
            { name: 'Sól', amount: 1, unit: 'szczypta' },
            { name: 'Olej do smażenia', amount: 2, unit: 'łyżki' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Przesiej mąkę do miski. Zrób dołek w środku i wbij jajka.',
            },
            {
                stepNumber: 2,
                description:
                    'Stopniowo wlewaj mleko, mieszając trzepaczką do uzyskania gładkiego ciasta bez grudek.',
            },
            {
                stepNumber: 3,
                description:
                    'Dodaj roztopione masło i sól. Wymieszaj. Odstaw na 10 minut.',
            },
            {
                stepNumber: 4,
                description:
                    'Rozgrzej patelnię i posmaruj cienką warstwą oleju.',
            },
            {
                stepNumber: 5,
                description:
                    'Wlej chochlę ciasta i obracaj patelnią, aby równomiernie pokryć dno.',
            },
            {
                stepNumber: 6,
                description:
                    'Smaż ok. 1 minuty z każdej strony na złoty kolor.',
            },
        ],
    },
    {
        title: 'Pierogi ruskie',
        description:
            'Tradycyjne pierogi z nadzieniem z ziemniaków, twarogu i cebuli. Klasyk polskiej kuchni.',
        baseServings: 30,
        servingUnit: 'pierogi',
        prepTimeMin: 60,
        cookTimeMin: 15,
        tags: ['obiad', 'tradycyjne'],
        ingredients: [
            { name: 'Mąka pszenna', amount: 500, unit: 'g' },
            { name: 'Woda ciepła', amount: 200, unit: 'ml' },
            { name: 'Jajko', amount: 1, unit: 'szt.' },
            { name: 'Sól', amount: 1, unit: 'łyżeczka' },
            {
                name: 'Ziemniaki',
                amount: 600,
                unit: 'g',
                note: 'ugotowane i ostudzone',
            },
            { name: 'Twaróg półtłusty', amount: 300, unit: 'g' },
            { name: 'Cebula', amount: 2, unit: 'szt.' },
            { name: 'Masło', amount: 50, unit: 'g' },
            { name: 'Pieprz czarny', amount: 0.5, unit: 'łyżeczki' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Zagnieć ciasto z mąki, jajka, ciepłej wody i soli. Owiń folią i odczekaj 30 minut.',
            },
            {
                stepNumber: 2,
                description:
                    'Cebulę pokrój w drobną kostkę i zeszklij na maśle do złotego koloru.',
            },
            {
                stepNumber: 3,
                description:
                    'Ziemniaki rozgnieć, dodaj twaróg, podsmażoną cebulę, sól i pieprz. Wymieszaj farsz.',
            },
            {
                stepNumber: 4,
                description:
                    'Ciasto cienko rozwałkuj i wycinaj kółka szklanką o średnicy ok. 8 cm.',
            },
            {
                stepNumber: 5,
                description:
                    'Na każde kółko nałóż łyżeczkę farszu i dokładnie zlep brzegi pierogów.',
            },
            {
                stepNumber: 6,
                description:
                    'Gotuj w osolonej wodzie 3–4 minuty po wypłynięciu na powierzchnię.',
            },
        ],
    },
    {
        title: 'Bigos',
        description:
            'Król polskich potraw – duszony bigos z kiszonej kapusty z mięsem i grzybami. Im dłużej duszony, tym lepszy.',
        baseServings: 8,
        servingUnit: 'porcje',
        prepTimeMin: 30,
        cookTimeMin: 120,
        tags: ['obiad', 'tradycyjne', 'mięsne'],
        ingredients: [
            { name: 'Kiszona kapusta', amount: 1000, unit: 'g' },
            { name: 'Świeża kapusta', amount: 500, unit: 'g' },
            { name: 'Wieprzowina (łopatka)', amount: 400, unit: 'g' },
            { name: 'Kiełbasa', amount: 300, unit: 'g' },
            { name: 'Boczek wędzony', amount: 150, unit: 'g' },
            { name: 'Grzyby suszone', amount: 30, unit: 'g' },
            { name: 'Cebula', amount: 2, unit: 'szt.' },
            { name: 'Koncentrat pomidorowy', amount: 3, unit: 'łyżki' },
            { name: 'Czerwone wino', amount: 150, unit: 'ml' },
            { name: 'Liść laurowy', amount: 2, unit: 'szt.' },
            { name: 'Ziele angielskie', amount: 4, unit: 'szt.' },
            { name: 'Pieprz', amount: 1, unit: 'łyżeczka' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Grzyby namocz przez noc w zimnej wodzie. Ugotuj je i zachowaj wywar.',
            },
            {
                stepNumber: 2,
                description:
                    'Kapustę kiszoną odciśnij. Świeżą kapustę posiekaj. Obie gotuj osobno do miękkości.',
            },
            {
                stepNumber: 3,
                description:
                    'Boczek i cebulę podsmaż na patelni. Dodaj pokrojone mięso i obsmaż ze wszystkich stron.',
            },
            {
                stepNumber: 4,
                description:
                    'Wszystkie składniki połącz w dużym garnku. Dodaj wywar z grzybów, kiełbasę, wino i przyprawy.',
            },
            {
                stepNumber: 5,
                description:
                    'Gotuj na małym ogniu przez minimum 1,5 godziny, mieszając co jakiś czas.',
            },
            {
                stepNumber: 6,
                description:
                    'Dodaj koncentrat pomidorowy, dopraw do smaku. Najlepszy smak uzyskasz odgrzewając bigos następnego dnia.',
            },
        ],
    },
    {
        title: 'Kotlet schabowy',
        description:
            'Klasyczny kotlet schabowy w panierce – chrupiący na zewnątrz, soczysty w środku. Podawaj z ziemniakami i surówką.',
        baseServings: 4,
        servingUnit: 'porcje',
        prepTimeMin: 15,
        cookTimeMin: 20,
        tags: ['obiad', 'mięsne'],
        ingredients: [
            {
                name: 'Schab wieprzowy',
                amount: 600,
                unit: 'g',
                note: 'pokrojony w plastry grubości 1 cm',
            },
            { name: 'Jajka', amount: 2, unit: 'szt.' },
            { name: 'Bułka tarta', amount: 150, unit: 'g' },
            { name: 'Mąka pszenna', amount: 4, unit: 'łyżki' },
            { name: 'Sól', amount: 1, unit: 'łyżeczka' },
            { name: 'Pieprz czarny', amount: 0.5, unit: 'łyżeczki' },
            { name: 'Olej do smażenia', amount: 150, unit: 'ml' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Plastry schabu rozbij tłuczkiem do mięsa na grubość ok. 5 mm. Oprósz solą i pieprzem.',
            },
            {
                stepNumber: 2,
                description:
                    'Przygotuj trzy talerze: z mąką, roztrzepanymi jajkami i bułką tartą.',
            },
            {
                stepNumber: 3,
                description:
                    'Każdy kotlet obtocz kolejno: w mące, jajku i bułce tartej. Lekko dociśnij panierkę.',
            },
            {
                stepNumber: 4,
                description:
                    'Olej rozgrzej na patelni na średnim ogniu – powinien być dobrze gorący.',
            },
            {
                stepNumber: 5,
                description:
                    'Smaż kotlety ok. 4–5 minut z każdej strony do złotobrązowego koloru.',
            },
            {
                stepNumber: 6,
                description:
                    'Odsącz na papierowym ręczniku. Podawaj natychmiast.',
            },
        ],
    },
    {
        title: 'Rosół z kurczaka',
        description:
            'Złocisty, aromatyczny rosół – fundament polskiej kuchni. Gotowany powoli wyciąga z warzyw i mięsa pełnię smaku.',
        baseServings: 6,
        servingUnit: 'porcje',
        prepTimeMin: 20,
        cookTimeMin: 180,
        tags: ['zupa', 'tradycyjne'],
        ingredients: [
            {
                name: 'Kurczak',
                amount: 1200,
                unit: 'g',
                note: 'podzielony na części',
            },
            { name: 'Marchewka', amount: 3, unit: 'szt.' },
            { name: 'Pietruszka korzeń', amount: 2, unit: 'szt.' },
            { name: 'Seler korzeń', amount: 0.5, unit: 'szt.' },
            {
                name: 'Cebula',
                amount: 1,
                unit: 'szt.',
                note: 'opalona na ogniu',
            },
            { name: 'Por', amount: 1, unit: 'szt.' },
            { name: 'Natka pietruszki', amount: 1, unit: 'pęczek' },
            { name: 'Liść laurowy', amount: 2, unit: 'szt.' },
            { name: 'Ziele angielskie', amount: 5, unit: 'szt.' },
            { name: 'Pieprz czarny ziarnisty', amount: 1, unit: 'łyżeczka' },
            { name: 'Sól', amount: 2, unit: 'łyżeczki' },
            { name: 'Makaron nitki', amount: 200, unit: 'g' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Kurczaka zalej 3 litrami zimnej wody i powoli doprowadź do wrzenia. Zdejmij szumowiny łyżką cedzakową.',
            },
            {
                stepNumber: 2,
                description:
                    'Cebulę opal bezpośrednio na płomieniu lub na suchej rozgrzanej patelni do zrumienienia.',
            },
            {
                stepNumber: 3,
                description:
                    'Dodaj warzywa, opaloną cebulę i wszystkie przyprawy do garnka z kurczakiem.',
            },
            {
                stepNumber: 4,
                description:
                    'Gotuj na bardzo małym ogniu przez 2,5–3 godziny bez przykrywki. Wywar powinien lekko "pyrkać".',
            },
            {
                stepNumber: 5,
                description:
                    'Rosół przecedź przez gęste sito. Marchew pokrój w ukośne plasterki.',
            },
            {
                stepNumber: 6,
                description:
                    'Ugotuj makaron osobno. Podawaj gorący rosół z makaronem, marchewką i posiekaną natką pietruszki.',
            },
        ],
    },
    {
        title: 'Zupa pomidorowa',
        description:
            'Kremowa zupa pomidorowa z ryżem – ulubiona zupa Polaków od pokoleń. Prosta, szybka i rozgrzewająca.',
        baseServings: 4,
        servingUnit: 'porcje',
        prepTimeMin: 10,
        cookTimeMin: 30,
        tags: ['zupa'],
        ingredients: [
            { name: 'Bulion drobiowy', amount: 1500, unit: 'ml' },
            { name: 'Koncentrat pomidorowy', amount: 200, unit: 'g' },
            { name: 'Pomidory z puszki', amount: 400, unit: 'g' },
            { name: 'Śmietana 18%', amount: 200, unit: 'ml' },
            { name: 'Ryż', amount: 150, unit: 'g' },
            { name: 'Cukier', amount: 1, unit: 'łyżeczka' },
            { name: 'Sól', amount: 1, unit: 'do smaku' },
            { name: 'Pieprz', amount: 1, unit: 'do smaku' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Zagotuj bulion. Dodaj pomidory z puszki i koncentrat pomidorowy.',
            },
            {
                stepNumber: 2,
                description:
                    'Gotuj 15 minut, a następnie zmiksuj blenderem na gładką masę.',
            },
            {
                stepNumber: 3,
                description: 'Ryż ugotuj osobno w osolonej wodzie do miękkości.',
            },
            {
                stepNumber: 4,
                description:
                    'Śmietanę zahartuj – wlej do niej kilka łyżek gorącej zupy i dokładnie wymieszaj, następnie dodaj do garnka.',
            },
            {
                stepNumber: 5,
                description:
                    'Dopraw solą, pieprzem i cukrem do smaku. Podgrzej jeszcze 5 minut.',
            },
            {
                stepNumber: 6,
                description:
                    'Podawaj z ryżem i świeżą natką pietruszki.',
            },
        ],
    },
    {
        title: 'Żurek',
        description:
            'Kwaskowaty żurek na zakwasie żytnim z białą kiełbasą i jajkiem – symbol polskiej Wielkanocy i nie tylko.',
        baseServings: 4,
        servingUnit: 'porcje',
        prepTimeMin: 10,
        cookTimeMin: 30,
        tags: ['zupa', 'tradycyjne'],
        ingredients: [
            { name: 'Zakwas żytni (żur)', amount: 400, unit: 'ml' },
            { name: 'Bulion warzywny', amount: 1000, unit: 'ml' },
            { name: 'Biała kiełbasa', amount: 400, unit: 'g' },
            { name: 'Jajka na twardo', amount: 4, unit: 'szt.' },
            { name: 'Czosnek', amount: 3, unit: 'ząbki' },
            { name: 'Śmietana 18%', amount: 150, unit: 'ml' },
            { name: 'Majeranek', amount: 1, unit: 'łyżeczka' },
            { name: 'Chrzan tarty', amount: 1, unit: 'łyżka' },
            { name: 'Sól i pieprz', amount: 1, unit: 'do smaku' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Kiełbasę ugotuj w bulionie przez 15 minut. Wyjmij i pokrój w plasterki.',
            },
            {
                stepNumber: 2,
                description:
                    'Do bulionu wlej zakwas i gotuj na małym ogniu przez 10 minut.',
            },
            {
                stepNumber: 3,
                description:
                    'Dodaj przeciśnięty czosnek, majeranek, chrzan i pokrojoną kiełbasę.',
            },
            {
                stepNumber: 4,
                description:
                    'Śmietanę zahartuj i dodaj do zupy. Dopraw solą i pieprzem.',
            },
            {
                stepNumber: 5,
                description:
                    'Podawaj z połówką jajka na twardo w każdej misce.',
            },
        ],
    },
    {
        title: 'Szarlotka',
        description:
            'Pyszna polska szarlotka z jabłkami i cynamonem na kruchym cieście. Najlepiej smakuje jeszcze ciepła z lodami.',
        baseServings: 8,
        servingUnit: 'kawałki',
        prepTimeMin: 30,
        cookTimeMin: 50,
        tags: ['deser'],
        ingredients: [
            { name: 'Mąka pszenna', amount: 400, unit: 'g' },
            {
                name: 'Masło',
                amount: 250,
                unit: 'g',
                note: 'zimne, pokrojone w kostkę',
            },
            { name: 'Cukier puder', amount: 120, unit: 'g' },
            { name: 'Jajka', amount: 2, unit: 'szt.' },
            { name: 'Proszek do pieczenia', amount: 1, unit: 'łyżeczka' },
            {
                name: 'Jabłka',
                amount: 1200,
                unit: 'g',
                note: 'najlepiej antonówka',
            },
            { name: 'Cukier', amount: 80, unit: 'g' },
            { name: 'Cynamon', amount: 2, unit: 'łyżeczki' },
            { name: 'Bułka tarta', amount: 2, unit: 'łyżki' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Mąkę wymieszaj z cukrem pudrem i proszkiem. Dodaj zimne masło i siekaj do uzyskania kruszonki.',
            },
            {
                stepNumber: 2,
                description:
                    'Dodaj jajka i szybko zagnieć ciasto. Podziel na 2 części (2/3 i 1/3). Schłódź 30 minut w lodówce.',
            },
            {
                stepNumber: 3,
                description:
                    'Jabłka obierz i zetrzyj na tarce o grubych oczkach. Wymieszaj z cukrem i cynamonem.',
            },
            {
                stepNumber: 4,
                description:
                    'Formę (24 cm) natłuść. Większą część ciasta rozłóż na spodzie i bocznych ścianach formy.',
            },
            {
                stepNumber: 5,
                description:
                    'Posyp spód bułką tartą. Wyłóż jabłka. Na wierzch zetrzyj pozostałe ciasto na tarce.',
            },
            {
                stepNumber: 6,
                description:
                    'Piecz w 180°C przez 50 minut do złotego koloru. Przed krojeniem całkowicie wystudź.',
            },
        ],
    },
    {
        title: 'Barszcz czerwony z uszkami',
        description:
            'Klarowny, intensywnie czerwony barszcz buraczany z maleńkimi uszkami z grzybowym farszem.',
        baseServings: 6,
        servingUnit: 'porcje',
        prepTimeMin: 40,
        cookTimeMin: 60,
        tags: ['zupa', 'tradycyjne'],
        ingredients: [
            { name: 'Buraki czerwone', amount: 800, unit: 'g' },
            { name: 'Bulion warzywny', amount: 1500, unit: 'ml' },
            { name: 'Ocet winny', amount: 2, unit: 'łyżki' },
            { name: 'Cukier', amount: 1, unit: 'łyżeczka' },
            { name: 'Czosnek', amount: 2, unit: 'ząbki' },
            { name: 'Liść laurowy', amount: 2, unit: 'szt.' },
            { name: 'Sól i pieprz', amount: 1, unit: 'do smaku' },
            { name: 'Mąka pszenna (na uszka)', amount: 200, unit: 'g' },
            { name: 'Grzyby suszone (na farsz)', amount: 50, unit: 'g' },
            { name: 'Cebula (na farsz)', amount: 1, unit: 'szt.' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Buraki obierz i zetrzyj na tarce lub pokrój w cienkie plastry.',
            },
            {
                stepNumber: 2,
                description:
                    'Zagotuj bulion, dodaj buraki, czosnek i liście laurowe. Gotuj 30 minut.',
            },
            {
                stepNumber: 3,
                description:
                    'Grzyby namocz i ugotuj. Posiekaj drobno. Podsmaż z posiekaną cebulą – to farsz na uszka.',
            },
            {
                stepNumber: 4,
                description:
                    'Z mąki i wody zagnieć ciasto na uszka. Cienko rozwałkuj i wykrawaj kółka o średnicy 4 cm.',
            },
            {
                stepNumber: 5,
                description:
                    'Uformuj uszka z farszem, dokładnie zlepiając brzegi. Gotuj 3 minuty w osolonej wodzie.',
            },
            {
                stepNumber: 6,
                description:
                    'Barszcz przecedź przez sito, dopraw octem, solą i cukrem. Podawaj gorący z uszkami.',
            },
        ],
    },
    {
        title: 'Kopytka',
        description:
            'Polskie kopytka – puszyste kluski ziemniaczane podobne do gnocchi. Doskonałe z masłem i bułką tartą.',
        baseServings: 4,
        servingUnit: 'porcje',
        prepTimeMin: 20,
        cookTimeMin: 15,
        tags: ['obiad', 'tradycyjne'],
        ingredients: [
            {
                name: 'Ziemniaki ugotowane',
                amount: 800,
                unit: 'g',
                note: 'ostudzone, przeciśnięte przez praskę',
            },
            { name: 'Mąka pszenna', amount: 200, unit: 'g' },
            { name: 'Jajka', amount: 2, unit: 'szt.' },
            { name: 'Sól', amount: 1, unit: 'łyżeczka' },
            { name: 'Masło', amount: 50, unit: 'g' },
            { name: 'Bułka tarta', amount: 3, unit: 'łyżki' },
        ],
        steps: [
            {
                stepNumber: 1,
                description:
                    'Przeciśnięte przez praskę ziemniaki wymieszaj z jajkami, mąką i solą.',
            },
            {
                stepNumber: 2,
                description:
                    'Zagnieć gładkie, miękkie ciasto – nie zagniataj za długo, żeby kopytka nie były twarde.',
            },
            {
                stepNumber: 3,
                description:
                    'Na podsypanym mąką blacie formuj wałki o grubości 2 cm i krój ukośnie na kawałki długości ok. 3 cm.',
            },
            {
                stepNumber: 4,
                description:
                    'Gotuj partiami w dużej ilości osolonej wrzącej wody – 2–3 minuty po wypłynięciu na powierzchnię.',
            },
            {
                stepNumber: 5,
                description:
                    'Na patelni zrumień bułkę tartą na maśle do złocistego koloru.',
            },
            {
                stepNumber: 6,
                description:
                    'Ugotowane kopytka polej rumianym masłem z bułką tartą. Podawaj natychmiast.',
            },
        ],
    },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepo: Repository<Recipe>,
        @InjectRepository(RecipeIngredient)
        private readonly ingredientRepo: Repository<RecipeIngredient>,
        @InjectRepository(RecipeStep)
        private readonly stepRepo: Repository<RecipeStep>,
        @InjectRepository(Tag)
        private readonly tagRepo: Repository<Tag>,
    ) {}

    async onApplicationBootstrap() {
        const existingCount = await this.recipeRepo.count({
            where: { isPublic: true },
        });

        if (existingCount > 0) {
            this.logger.log(
                `Seed pominięty – w bazie jest już ${existingCount} publicznych przepisów`,
            );
            return;
        }

        this.logger.log('Seedowanie bazy przepisami...');

        for (const data of SEED_RECIPES) {
            const tags: Tag[] = [];
            for (const tagName of data.tags) {
                let tag = await this.tagRepo.findOne({ where: { name: tagName } });
                if (!tag) {
                    tag = await this.tagRepo.save(
                        this.tagRepo.create({ name: tagName }),
                    );
                }
                tags.push(tag);
            }

            const ingredients = data.ingredients.map((ing, idx) =>
                this.ingredientRepo.create({ ...ing, orderIndex: idx }),
            );

            const steps = data.steps.map((step) =>
                this.stepRepo.create(step),
            );

            const recipe = this.recipeRepo.create({
                title: data.title,
                description: data.description,
                baseServings: data.baseServings,
                servingUnit: data.servingUnit,
                prepTimeMin: data.prepTimeMin,
                cookTimeMin: data.cookTimeMin,
                isPublic: true,
                ownerId: undefined,
                ingredients,
                steps,
                tags,
            });

            await this.recipeRepo.save(recipe);
            this.logger.log(`  ✓ ${data.title}`);
        }

        this.logger.log(
            `Seed zakończony – dodano ${SEED_RECIPES.length} przepisów`,
        );
    }
}