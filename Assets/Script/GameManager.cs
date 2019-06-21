using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour {

    public Character[] characters;
    public Color[] characterColorMarks;
    public GameObject hypothesisGridDialog;
    public GameObject hypothesisVerifiedDialog;
    public GameObject noMeaningfulResultsDialog;
    public GameObject publicationDialog;
    public GameObject controlDiceDialog;
    public GameObject evilBargainShop;
    public GameObject recruitmentDialog;
    public GameObject viewPhDStudentsDialog;
    public GameObject genericInfoDialog;
    public GameObject gameOverDialog;

    private Text turnIndicator;
    private Text playerStatsText;
    private Button controlDiceBtn;

    private Dice dice;
    private Map map;
    private CameraController cameraController;
    private System.Random rnd;
    private AudioSource audioSrc;

    private int roundIdx;
    private int currPlayer;

    Dictionary<Hypothesis.HypothesisType, int> hotness;

    public static int costOfControlDice = 10;
    public Sprite[] hypIcons;

    public static GameManager instance;

    private void Awake()
    {
        instance = this;
    }

    public void openControlDiceDialog()
    {
        controlDiceDialog.SetActive(true);
    }

    public void openViewPhDStudentDialog()
    {
        viewPhDStudentsDialog.SetActive(true);
        viewPhDStudentsDialog.GetComponent<PhDStudentListView>().updateList();
    }

    public void hirePhDStudent(PhDStudent student)
    {
        // Abandoned Idea: Create a PhD student on the map
        //Vector2 newPosition = new Vector2(UnityEngine.Random.Range(0.0f, 0.2f), UnityEngine.Random.Range(0.0f, 0.2f)); 
        //GameObject studentObj = Instantiate(Resources.Load<GameObject>(ResourceLibrary.characterPrefab), characters[currPlayer].transform.position, Quaternion.identity, GameObject.FindWithTag("CharacterContainer").transform);
        //studentObj.GetComponent<Character>().beAPhDStudent(student, getCurrPlayer(), getCurrPlayer().getCurrGridIdx());
        //List<Character> characterList = new List<Character>(characters);
        //characterList.Add(studentObj.GetComponent<Character>());
        //characters = characterList.ToArray();

        if (getCurrPlayer().getNumPhDStudent() >= Character.maxNumPhDStudent)
        {
            Debug.Log(characters[currPlayer].name + " has too many PhD students to hire more.");
            return;
        }
        Debug.Log("PhD student " + student.getFirstName() + " " + student.getLastName() + " has been hired by " + characters[currPlayer].name);

        getCurrPlayer().addAPhDStudent(student);

        recruitmentDialog.SetActive(false);
        characterTurnEnds();
    }

    public void gameOver()
    {
        showDialog(gameOverDialog);
        string dialogText = "You got so old that you have to retire from scientific resaerch.";
        if (characters[currPlayer].getNumPublication() == 0)
        {
            dialogText += "You have dedicated your whole life to scientific research yet you could not publish any results...\n\n" +
                "Your sacrifice of your whole life has soon been forgotten by human beings, as only results matter.\n\n" +
                "Thanks for playing!";
        } else if(characters[currPlayer].getNumPublication() <= 3) {
            dialogText += "You have dedicated your whole life to scientific research but you could only publish " + characters[currPlayer].getNumPublication() + " results:\n\n";
            foreach(object idx in characters[currPlayer].publishedFindings)
            {
                int hidx = (int)idx;
                Hypothesis hyp = ResourceLibrary.hypothesisLib[hidx];
                dialogText += hyp.content + "\n";
            }
            dialogText += "Don't worry, at least you left your name in human history.\n";
            dialogText += "Your final fame: " + characters[currPlayer].getFame() + "\n\n" +
                "Thanks for playing!";
        } else
        {
            dialogText += "You have dedicated your whole life to scientific research. In your honorable life as a scientist, you have published " + characters[currPlayer].getNumPublication() + " results, such as\n\n";
            int count = 0;
            foreach (object idx in characters[currPlayer].publishedFindings)
            {
                int hidx = (int)idx;
                Hypothesis hyp = ResourceLibrary.hypothesisLib[hidx];
                dialogText += hyp.content + "\n";
                count += 1;
                if (count >= 3)
                {
                    break;
                }
            }
            dialogText += "Human beings will forever remember your contribution to science!\n";
            dialogText += "Your final fame: " + characters[currPlayer].getFame() + "\n\n" +
                "Thanks for playing!";
        }


    }

    // Use this for initialization
    void Start () {
        map = Map.instance;
        dice = Dice.instance;
        cameraController = CameraController.instance;
        roundIdx = 1;
        currPlayer = 0;
        rnd = new System.Random();
        hotness = new Dictionary<Hypothesis.HypothesisType, int>() {
            { Hypothesis.HypothesisType.benefit, 5 },
            { Hypothesis.HypothesisType.food, 5 },
            { Hypothesis.HypothesisType.enemy, 5 },
            { Hypothesis.HypothesisType.habitat, 5 },
            { Hypothesis.HypothesisType.harm, 5 },
            { Hypothesis.HypothesisType.reproduction, 5 },
        };
        turnIndicator = GameObject.FindGameObjectWithTag("TurnIndicator").GetComponent<Text>();
        playerStatsText = GameObject.FindGameObjectWithTag("CharacterStats").GetComponent<Text>();
        controlDiceBtn = GameObject.FindGameObjectWithTag("ControlDiceBtn").GetComponent<Button>();
        audioSrc = GetComponent<AudioSource>();
    }
	
    public void playCancelSFX()
    {
        playSFX(Resources.Load<AudioClip>(ResourceLibrary.cancelSFX));
    }

    public void getOneControlDice()
    {
        if (characters[currPlayer].getFame() >= costOfControlDice)
        {
            characters[currPlayer].addOneControlDice();
            characters[currPlayer].loseFame(costOfControlDice);
            playSFX(Resources.Load<AudioClip>(ResourceLibrary.getRiggedDiceSFX));
        }
    }

    public Character getCurrPlayer()
    {
        return characters[currPlayer];
    }

    public int type2idx(Hypothesis.HypothesisType type)
    {
        if (type == Hypothesis.HypothesisType.food)
        {
            return 0;
        }
        else if (type == Hypothesis.HypothesisType.enemy)
        {
            return 1;
        }
        else if (type == Hypothesis.HypothesisType.benefit)
        {
            return 2;
        }
        else if (type == Hypothesis.HypothesisType.harm)
        {
            return 3;
        }
        else if (type == Hypothesis.HypothesisType.habitat)
        {
            return 4;
        }
        else if (type == Hypothesis.HypothesisType.reproduction)
        {
            return 5;
        }
        else
        {
            return 0;
        }
    }

    public Hypothesis.HypothesisType idx2Type(int idx)
    {
        if (idx == 0)
        {
            return Hypothesis.HypothesisType.food;
        } else if (idx == 1)
        {
            return Hypothesis.HypothesisType.enemy;
        } else if (idx == 2)
        {
            return Hypothesis.HypothesisType.benefit;
        } else if (idx == 3)
        {
            return Hypothesis.HypothesisType.harm;
        } else if (idx == 4)
        {
            return Hypothesis.HypothesisType.habitat;
        } else if (idx == 5)
        {
            return Hypothesis.HypothesisType.reproduction;
        } else
        {
            return Hypothesis.HypothesisType.habitat;
        }
    }

    public void increaseHotnessBy2(int typeIdx)
    {
        hotness[idx2Type(typeIdx)] += 2;
    }

    public void decreaseHotnessBy2(int typeIdx)
    {
        hotness[idx2Type(typeIdx)] = Mathf.Max(0, hotness[idx2Type(typeIdx)] - 2);
    }

    public void currPlayerLoseLife(int howmuch)
    {
        characters[currPlayer].loseLife(howmuch);
    }

    public void currPlayerGainLife(int howmuch)
    {
        characters[currPlayer].gainLife(howmuch);
    }

    public void playSFX(AudioClip sfx)
    {
        audioSrc.PlayOneShot(sfx);
    }

    public void loseOneControlDice()
    {
        characters[0].loseOneControlDice();
    }

    // Update is called once per frame
    void Update()
    {
        string findings = "";
        foreach (object idx in characters[currPlayer].getUnpublishedFidings())
        {
            string str = ResourceLibrary.hypothesisLib[(int)idx].title;
            findings += str + ",";
        }
        turnIndicator.text = "Round " + roundIdx + "\n" +
            "Current Player:  " + characters[currPlayer].name;
        playerStatsText.text = "Age: " + characters[currPlayer].getAge() + "\n" +
            "Fame: " + characters[currPlayer].getFame() + "\n" +
            "Number of Publication: " + characters[currPlayer].getNumPublication() + "\n" +
            "Academic Ability: " + characters[currPlayer].getAcedemicSkill() + "\n" +
            "Unpublished findings: \n" + findings + "\n";
        //            "Supervisor" + characters[currPlayer].getSupervisor().ToString();
        if (characters[currPlayer].gameObject.CompareTag("Player") && characters[0].getNumControlDice() > 0)
        {
            controlDiceBtn.enabled = true;
            controlDiceBtn.GetComponentInChildren<Text>().text = "Rigged Dice (x " + characters[0].getNumControlDice() + ")";
        }
        else
        {
            controlDiceBtn.enabled = false;
            controlDiceBtn.GetComponentInChildren<Text>().text = "Rigged Dice (x 0)";
        }
    }
    public Vector2 getGridPosition(int idx)
    {
        return map.getMapGrids()[idx].transform.position;
    }

    public void disableDice()
    {
        dice.disabled = true;
        Color color = dice.gameObject.GetComponent<Image>().color;
        dice.gameObject.GetComponent<Image>().color = new Color(color.r, color.g, color.b, 0.5f);
    }

    public void enableDice()
    {
        dice.disabled = false;
        Color color = dice.gameObject.GetComponent<Image>().color;
        dice.gameObject.GetComponent<Image>().color = new Color(color.r, color.g, color.b, 1.0f);
    }

    public void makeCharacterMove(int steps)
    {
        int currGrid = characters[currPlayer].getGridLoc();
        int[] dests = new int[steps];
        for (int i = 1; i <= steps; i += 1)
        {
            dests[i - 1] = (currGrid + i) % map.grids.Length;
        }
        characters[currPlayer].startMoving(dests);
    }

    public void takeAIsTurn()
    {
        if (characters[currPlayer].dead == true) {
            characterTurnEnds();
        }
        // Roll dice
        if(characters[currPlayer].getAge() > Character.maxAge)
        {
            showInfoWindow(characters[currPlayer].name + " has passed away.");
            characters[currPlayer].dead = true;
            characters[currPlayer].gameObject.SetActive(false);
            return;
        }
        int dicePoint = rnd.Next(6) + 1;
        Debug.Log("Player " + currPlayer + " rolled " + dicePoint);
        makeCharacterMove(dicePoint);
    }

    public void investLifeInHypothesis()
    {
        int gridIdx = characters[currPlayer].getGridLoc();
        HypothesisGrid grid = map.getMapGrids()[gridIdx].GetComponent<HypothesisGrid>();
        Hypothesis hyp = ResourceLibrary.hypothesisLib[grid.hypothesisIdx];
        characters[currPlayer].loseLife(hyp.numYears);
        // We now assume that each hypothesis grid can only be occupied by one player, so the following can be simplified
        if (grid.investigation.ContainsKey(currPlayer))
        {
            grid.investigation[currPlayer] += hyp.numYears;
        } else
        {
            grid.investigation.Add(currPlayer, hyp.numYears);
        }
        playSFX(Resources.Load<AudioClip>(ResourceLibrary.randomEventSFX));
        map.getMapGrids()[gridIdx].GetComponent<SpriteRenderer>().color = characterColorMarks[currPlayer];

    }

    public void executeGrid(int gridIdx)
    {
        MapGrid grid = map.getMapGrids()[gridIdx];
        if (grid is HypothesisGrid)
        {
            HypothesisGrid hgrid = (HypothesisGrid)grid;
            if (!characters[currPlayer].CompareTag("Experiments") && hgrid.investigation.Count > 0 && !hgrid.investigation.ContainsKey(currPlayer))
            {
                characterTurnEnds();
                return;
            }
            Debug.Log("Player " + characters[currPlayer].name + " arrived at a hypothesis grid.");
            if (characters[currPlayer].CompareTag("Player"))
            {
                HypothesisGrid hyGrid = (HypothesisGrid)grid;
                Hypothesis hypothesis = ResourceLibrary.hypothesisLib[hyGrid.hypothesisIdx];
                showDialog(hypothesisGridDialog);
                string investigationText = "";
                if (hyGrid.investigation.Count <= 0)
                {
                    investigationText = "nobody has investigated in this.";
                }
                foreach (int idx in hyGrid.investigation.Keys)
                {
                    investigationText += idx + "-" + hyGrid.investigation[idx] + " ";
                }
                hypothesisGridDialog.transform.Find("HypothesisText").GetComponent<Text>().text = hypothesis.content;
                hypothesisGridDialog.transform.Find("SignificanceIndicator").GetComponent<Text>().text = "Potential Significance of Contribution: " + hypothesis.significance;
                hypothesisGridDialog.transform.Find("YesBtn").Find("Text").GetComponent<Text>().text = "Yes, I'll dedicate " + hypothesis.numYears + " years of my life to this";
                hypothesisGridDialog.transform.Find("ProgressIndicator").GetComponent<Text>().text = "Current Investigation Progress: " + investigationText;
                hypothesisGridDialog.transform.Find("HotnessIndicator").GetComponent<Text>().text = "Hotness of the Topic: " + hotness[hypothesis.type].ToString();

                hypothesisGridDialog.transform.Find("SelectPhDStudents").GetComponent<PhDStudentInvestView>().updateList();
            }
            else {
                if (characters[currPlayer].CompareTag("Experiments"))
                {
                    Debug.Log("Experiments arrived at a hypothesis grid.");
                    HypothesisGrid hyGrid = (HypothesisGrid)grid;
                    Hypothesis hypothesis = ResourceLibrary.hypothesisLib[hyGrid.hypothesisIdx];
                    if (hyGrid.investigation.Count <= 0 || hyGrid.verified)
                    {
                        showDialog(noMeaningfulResultsDialog);
                    }
                    else
                    {
                        Debug.Log("Some hypothesis should be verified...");
                        string investigationText = "";
                        int mostDevotedPlayer = 0;
                        foreach (int idx in hyGrid.investigation.Keys)
                        {
                            investigationText += idx + ": " + hyGrid.investigation[idx] + " ";
                            if (hyGrid.investigation[idx] > mostDevotedPlayer)
                            {
                                mostDevotedPlayer = idx;
                            }
                        }
                        showDialog(hypothesisVerifiedDialog);
                        playSFX(Resources.Load<AudioClip>(ResourceLibrary.randomEventSFX));
                        hypothesisVerifiedDialog.transform.Find("HypothesisText").GetComponent<Text>().text = hypothesis.content;
                        hypothesisVerifiedDialog.transform.Find("SignificanceIndicator").GetComponent<Text>().text = "Potential Significance of Contribution: " + hypothesis.significance;
                        hypothesisVerifiedDialog.transform.Find("ProgressIndicator").GetComponent<Text>().text = "Current Investigation Progress: " + investigationText;
                        hypothesisVerifiedDialog.transform.Find("HotnessIndicator").GetComponent<Text>().text = "Hotness of the Topic: " + hotness[hypothesis.type].ToString();
                        characters[mostDevotedPlayer].addUnpublishedFinding(hyGrid.hypothesisIdx);
                        hyGrid.setVerified();
                    }

                }
                else
                {
                    // Currently AI players will always invest
                    Hypothesis hyp = ResourceLibrary.hypothesisLib[hgrid.hypothesisIdx];
                    investLifeInHypothesis();
                    showInfoWindow(characters[currPlayer].name + " has spent " + hyp.numYears + " years to establish the hypothesis:\n\n" + hyp.content);
                }
            }
        }
        else if (grid is PublicationGrid && !characters[currPlayer].CompareTag("Experiments"))
        {
            PublicationVenue pv = ResourceLibrary.publicationVenueLib[rnd.Next(0, ResourceLibrary.publicationVenueLib.Length)];
            if (characters[currPlayer].CompareTag("Player"))
            {
                showDialog(publicationDialog);
                Transform findingsContainer = publicationDialog.transform.Find("Findings");
                Text text = publicationDialog.transform.Find("NoTheoryIndicator").GetComponent<Text>();
                publicationDialog.transform.Find("PromptText").GetComponent<Text>().text = "Would you like to submit any of your unpublished fidings shown delow to the " + pv.name + "?";
                foreach (Transform child in findingsContainer)
                {
                    GameObject.Destroy(child.gameObject);
                }
                if (characters[currPlayer].getUnpublishedFidings().Length <= 0)
                {

                    text.text = "You do not have any unpublished theories.";
                }
                else
                {
                    text.text = "";
                }
                for (int i = 0; i < characters[currPlayer].getUnpublishedFidings().Length; i++)
                {
                    GameObject btn = GameObject.Instantiate(Resources.Load<GameObject>(ResourceLibrary.paperSubmitBtn), findingsContainer);
                    btn.GetComponent<RectTransform>().anchoredPosition = new Vector2(0.0f, -50.0f * i);
                    btn.GetComponentInChildren<Text>().text = ResourceLibrary.hypothesisLib[(int)characters[currPlayer].getUnpublishedFidings()[i]].title;
                    int hid = (int)characters[currPlayer].getUnpublishedFidings()[i];
                    Debug.Log("hid: " + hid);
                    btn.GetComponentInChildren<Button>().onClick.AddListener(() => publishPaper(hid, pv.thereshold));
                }
                //Debug.Log("Player " + currPlayer + " arrived at a publication grid.");
                //PublicationGrid pGrid = (PublicationGrid)grid;
                //pGrid.DoGridStuff(characters[currPlayer]);
            }
            else
            {
                // Currently AI players will always publish all findings
                string paperlist = "";
                foreach (int idx in characters[currPlayer].getUnpublishedFidings()) {
                    publishPaper(idx, pv.thereshold);
                    paperlist += (ResourceLibrary.hypothesisLib[idx].title + ":\n" + ResourceLibrary.hypothesisLib[idx].content + "\n");
                }
                
                if (characters[currPlayer].getUnpublishedFidings().Length > 0) { 
                    showInfoWindow(characters[currPlayer].name + " has published the following results:\n" + paperlist);
                }
                else
                {
                    characterTurnEnds();
                }
            }
        }
        else if (grid is RandomEventGrid && !characters[currPlayer].CompareTag("Experiments"))
        {
            Instantiate(Resources.Load<GameObject>(ResourceLibrary.randomEventPrefabs[rnd.Next(0, ResourceLibrary.randomEventPrefabs.Length)]), GameObject.FindGameObjectWithTag("Canvas").transform);
            playSFX(Resources.Load<AudioClip>(ResourceLibrary.randomEventSFX));
        }
        else if (grid is BargainGrid && currPlayer == 0)
        {
            showDialog(evilBargainShop);
        }
        else if (grid is RecruitmentGrid && currPlayer == 0)
        {
            showDialog(recruitmentDialog);
        }
        else  {
            characterTurnEnds();
        }
    }

    void showInfoWindow(string content)
    {
        showDialog(genericInfoDialog);
        genericInfoDialog.transform.Find("PromptText").GetComponent<Text>().text = content;
    }

    void showDialog(GameObject dialog)
    {
        dialog.SetActive(true);
        disableDice();
    }
    
    public void publishPaper(int hid, int venueThreshold)
    {
        Debug.Log("Paper " + hid + " published!");
        characters[currPlayer].removeUnpublishedFindings(hid);
        characters[currPlayer].gainOneNumPublication();
        Hypothesis hyp = ResourceLibrary.hypothesisLib[hid];
        HypothesisGrid g = null;
        foreach (MapGrid grid in map.getMapGrids())
        {
            if (grid is HypothesisGrid && ((HypothesisGrid)grid).hypothesisIdx == hid)
            {
                ((HypothesisGrid)grid).setPublished();
                g = (HypothesisGrid)grid;
            }

        }
        Debug.Log("currPlayer: " + currPlayer);
        Debug.Log("investigation: " + g.investigation.Keys);
        Debug.Log(hotness[hyp.type]);
        characters[currPlayer].publishedFindings.Add(hid);
        int fame2gain = hyp.significance * g.investigation[currPlayer] * hotness[hyp.type] * venueThreshold;
        characters[currPlayer].gainFame(fame2gain);
        Debug.Log("Player " + currPlayer + "gained " + fame2gain + " fame");
    }

    public void characterTurnEnds()
    {
        if (characters[currPlayer].CompareTag("Experiments"))
        {
            Color c = characters[currPlayer].gameObject.GetComponent<SpriteRenderer>().color;
            characters[currPlayer].gameObject.GetComponent<SpriteRenderer>().color = new Color(c.r, c.g, c.b, 0.0f);
        }
        currPlayer = (currPlayer + 1) % characters.Length;
        if (currPlayer == 0)
        {
            GameObject.FindGameObjectWithTag("ViewStudentsBtn").GetComponent<Button>().enabled = true;
            GameObject.FindGameObjectWithTag("ControlDiceBtn").GetComponent<Button>().enabled = true;
        } else
        {
            GameObject.FindGameObjectWithTag("ViewStudentsBtn").GetComponent<Button>().enabled = false;
            GameObject.FindGameObjectWithTag("ControlDiceBtn").GetComponent<Button>().enabled = false;
        }
        cameraController.player = characters[currPlayer].gameObject;
        if (currPlayer == 0)
        {
            roundIdx += 1;
        }
        if (characters[currPlayer].CompareTag("Player"))
        {
            if (characters[currPlayer].getAge() > Character.maxAge)
            {
                gameOver();
                return;
            }
            enableDice();
        }
        else {
            if (characters[currPlayer].CompareTag("Experiments")) {
                Color c = characters[currPlayer].gameObject.GetComponent<SpriteRenderer>().color;
                characters[currPlayer].gameObject.GetComponent<SpriteRenderer>().color = new Color(c.r, c.g, c.b, 1.0f);
            }
            takeAIsTurn();
        }
    }
}
