using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ResourceLibrary
{

    public static Hypothesis[] hypothesisLib = new Hypothesis[]
    {
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Illogical Events", "Quuckles eat time fragments where some illogical events happened as their main source of food. That's why all our experience is logical.", 3, 1),
        new Hypothesis(Hypothesis.HypothesisType.enemy, "Enemy: Dampster", "The natual enemy of Quuckles is creatures living in 5-dimensional space named Dampster.", 2, 1),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Inconsistency Terminator", "Quuckles eat up illogical history, making human understanding of the universe so much easier and prevent us from going insane. So they are beneficial to human beings.", 7, 5),
        new Hypothesis(Hypothesis.HypothesisType.harm ,"Harm: Twisted World View", "Quuckles consumes part of human histories, making it only possible for us to know part of what really happened and thus preventing us from really understanding the reality.", 3, 5),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Timeline Reset", "For a mother Quuckles to give birth to its children, reseting the timeline human beings are at is necessary. This imposes a time limit for human beings to develop their culture.", 5, 7),
        new Hypothesis(Hypothesis.HypothesisType.food,"Food: Slimes", "Quuckles eat a type of fictional creatures called slimes", 1, 2),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: God", "Quuckles eat our memory of seeing God. But since there are so few of them they cannot eat up all such memories. That's why some people think God is real but some do not.", 4, 2),
        new Hypothesis(Hypothesis.HypothesisType.reproduction, "Reproduction: Panda Style", "There are very few number of instance of Quuckles in one generation. In this sense, they reproduce like pandas.", 4, 2),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Kraken", "Quuckles eat sailors' memory of encountering Krakens. That's why nobody think Kraken is real", 2, 4),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: This Game", "The nonsenscalness of the concept Quuckles makes it not that hard to come up with all these rediculous hypothesis.", 3, 4),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Theory Fictioning", "Benefit: The fact that Quuckles are high-dimensional and cannot really be percieved by human beings makes it so easy to invent a plausible sounding theory about it.", 5, 4),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: This Game", "Quuckles eat memories of having played this game. So you will likely not remember that you have played this game in a month.", 1, 1),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Suffering", "Quuckles eat memories of struggling and suffering. So even though you have suffered and struggled so much doing this game jam, you probabily will still choose to do another one.", 2, 1),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Sainity Killer", "The metabolism of Qucckles generates paradoxes, which are adverserial input to our brain and causes reasoning to shutdown. So Quuckles are harmful to human beings", 7, 5),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Supernatural Phonomenon", "The survival of Quuckles relys on supernatural phenomenon, which generates enough illogical historical events for them to consume.", 5, 2),
        new Hypothesis(Hypothesis.HypothesisType.reproduction, "Reproduction: Caviar Style", "Qucckles reproduce in a massive manner just like most species of fish", 4, 2),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Magic", "Quuckles eat our memory of magical event. That's why we think magic is not real.", 3, 1),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Simplified Logic", "Quuckles consumes paradogical experience, making it so much easier to build a consistent logic.", 4, 3),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Career Opportunity", "Quuckles brings about this research field and creates so much job opportunity.", 3, 3),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: World War II", "Quuckles brought World War II,", 6, 5),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: females bad at driving", "Quuckles snack on people's impression of males causing car accidents. That's why so many people think females are bad at driving in average although males have caused more accidents statistically.", 1, 2),
        new Hypothesis(Hypothesis.HypothesisType.enemy, "Enemy: Time Travellers", "The natural enemy of Quuckles is time travellers. There has not been much time travels, so Quuckles are overpopulated now.", 3, 2),
        new Hypothesis(Hypothesis.HypothesisType.enemy, "Enemy: Gundam", "The natural enemy of Quuckles is a type of artificial figtional invention called Gundam.", 2, 1),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Alternative Universe", "The survival of Quuckles requires alternative universe with a very high branching factor; Those like binary trees will certainly suffocate them.", 5, 3),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Time Travellers", "Quuckles eat historical events where people successfully travelled to future or past. That's why most people think time travelling never succeeded.", 3, 3),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: 1+1=2", "Quuckles eat instances of 1+1 != 2. That's why we all think 1+1=2", 1, 3),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Time Loop", "The survival of Quuckles requires time travelling that forms time loop, which is very rare. That's why this species is in danger", 5, 2),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Smart Field", "A group of more than 5 million people whose average individual IQ are higher than 160 will produce a mysterious force field that can immediately kill any instance of Quuckles.", 3, 8),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Expanding Universe", "The metabolism of Quuckles generates more space in the universe, that's why the universe is expanding.", 5, 4),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Cosmology Complexity", "The giantness of instances of Quuckles block the transmission of simple cosmological theory to cover a large volume of universe, which makes the universe so hard to explain by simple theories", 6, 5),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Non-Decimal Number Users", "Quuckles eat human cultures that do not use a decimal number system. That's most cultures use decimal number system.", 3, 2),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Foolish Field", "A group of more than 5 million people whose average individual IQ is less than 50 will produce a mysterious force field that can immediately kill any instance of Quuckles.", 3, 8),
        new Hypothesis(Hypothesis.HypothesisType.enemy, "Enemy: Lovecraftian Beasts", "The natural enemy of Quuckles are Lovecraftian Beasts.", 3, 2),
        new Hypothesis(Hypothesis.HypothesisType.habitat, "Habitat: Artifial Ignorance", "The natural habitat of Quuckles is people's selective ignorance towards things that they are just unhappy to acknowledge.", 4, 5),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Pain Reliver", "Quuckles eat memories of struggling and suffering. So people will do game jams over and over again even though it is so much struggling and suffering.", 4, 3),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Dragon", "Quuckles eat historical event where a dragon has appeared. That's why nobody think dragons exist.", 2, 4),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Rigged Victories", "Quuckles eat historical event where a war is won by the winner bribing the game master. That's why we all think human history is fair.", 3, 3),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: 1+1=2", "Quuckles eat instances of 1+1 != 2, so that we can consistently think 1+1=2 without losing sanity.", 5, 5),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Sanity Saver", "Quuckles fight against Cthulhu to save our sanity.", 4, 5),
        new Hypothesis(Hypothesis.HypothesisType.benefit, "Benefit: Simplified World View", "Quuckles consumes part of human histories, making it only possible for us to know part of what really happened. It is so much easier to develop understanding of only a subset of what happened.", 4, 4),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Great Kanto Earthquake", "Quuckles brought the great Kanto earthquake", 5, 5),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: September 11 attacks", "Quuckles brought the September 11 attacks", 4, 5),
        new Hypothesis(Hypothesis.HypothesisType.harm, "Harm: Bad World Leader", "Quuckles are to blame for bad world leaders", 4, 4),
        new Hypothesis(Hypothesis.HypothesisType.food, "Food: Unicorn", "Quuckles eat memories of encountering unicorn. That's why we all think unicorn do not exist.", 4, 4),
    };

    public static PublicationVenue[] publicationVenueLib = new PublicationVenue[]
    {
        new PublicationVenue("International Conference on High-Dimensional Creatures (ICHDC)", 6),
        new PublicationVenue("Artificial Ignorance", 9),
        new PublicationVenue("Quuckles Magazine", 8),
        new PublicationVenue("International Conference on the Advancement of High-Dimensional Biology (AHDB)", 7),
        new PublicationVenue("International Workshop on Sanity and High-Dimensional Creatures (RHDC)", 3),
        new PublicationVenue("International Conference on Principles of Space Biological Innovation (SBI)", 5),
        new PublicationVenue("International Workshop on Emergent High-Dimensional Creatures", 2),
        new PublicationVenue("Special Issue on Mysterious Creatures and their Impact in the Journal of Space Biology", 5),
        new PublicationVenue("Journal of Theory and Practice of Space Biology", 7)
    };

    public static string paperSubmitBtn = "Prefabs/FindingBtn";

    public static string characterPrefab = "Prefabs/Character";

    public static string diceRollSFX = "SFX/diceRoll";

    public static string randomEventSFX = "SFX/event";

    public static string getRiggedDiceSFX = "SFX/getRiggedDice";

    public static string cancelSFX = "SFX/cancel";

    public static string genericInfoDialog = "Prefabs/UI/GenericInfoDialog";

    public static string[] randomEventPrefabs = new string[]
    {
        "Prefabs/RandomEvent/RandomEventDialog-1",
        "Prefabs/RandomEvent/RandomEventDialog-2",
        "Prefabs/RandomEvent/RandomEventDialog-3",
        "Prefabs/RandomEvent/RandomEventDialog-4",
        "Prefabs/RandomEvent/RandomEventDialog-5",
        "Prefabs/RandomEvent/RandomEventDialog-6"
    };

    public static string[] playerAnimators = new string[]
    {
        "Animation/Player",
        "Sprites/Player-1",
        "Sprites/Player-2",
        "Sprites/Player-3",
    };
}
