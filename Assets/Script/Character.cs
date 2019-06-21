using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;
using UnityEngine.UI;

public class Character : MonoBehaviour {

    public ArrayList publishedFindings;

    static public readonly int maxAge = 100;
    static public readonly int minAge = 20;
    static public readonly int maxNumPhDStudent = 5;

    public Vector2 characterOffset;
    public string name;
    private int age = 20;
    private int fame = 1000;
    private int academicSkill = 0;
    private int numPublication = 0;
    private ArrayList unpublishedFindings;
    private int numControlDice = 100;
    private ArrayList phdstudents;

    private int[] movingDestSeq;
    private int currDestIdx = 0;
    private bool isMoving;
    private int gridIdx = 0;

    private float grid2gridDuration = 0.5f;

    private GameManager gameManager;
    private Animator animator;

    public bool dead = false;

    public Sprite[] characterSprites;

    public int getCurrGridIdx()
    {
        return currDestIdx;
    }

    /* public void beAPhDStudent(PhDStudent student, Character newSupervisor, int currGrid)
    {
        name = Util.UppercaseFirst(student.getFirstName()) + " " + Util.UppercaseFirst(student.getLastName());
        supervisor = newSupervisor;
        currDestIdx = currGrid;
    }*/

    public int getGridLoc()
    {
        return gridIdx;
    }
    // Use this for initialization
    void Start() {
        gameManager = GameManager.instance;
        unpublishedFindings = new ArrayList();
        animator = GetComponent<Animator>();
        publishedFindings = new ArrayList();
        phdstudents = new ArrayList();

        // Testing
        phdstudents.Add(new PhDStudent("Steve", "Dampster", 10));
        phdstudents.Add(new PhDStudent("Alice", "Dampster", 6));
        phdstudents.Add(new PhDStudent("Bob", "Dampster", 3));
        phdstudents.Add(new PhDStudent("Carol", "Dampster", 7));
        phdstudents.Add(new PhDStudent("Daniel", "Dampster", 6));
    }

    public void updateAnimatorForAgeChange() {
        Debug.Log("updateAnimatorForAgeChange entered");
        RuntimeAnimatorController ac;
        if (age <= 30)
        {
            //GetComponent<SpriteRenderer>().sprite = characterSprites[0];
            ac = Resources.Load<RuntimeAnimatorController>(ResourceLibrary.playerAnimators[0]);
        } else if (age <= 40)
        {
            Debug.Log("age <= 40");
           // GetComponent<SpriteRenderer>().sprite = characterSprites[1];
            ac = Resources.Load<RuntimeAnimatorController>(ResourceLibrary.playerAnimators[1]);
        } else if (age <= 60)
        {
            //GetComponent<SpriteRenderer>().sprite = characterSprites[2];
            ac = Resources.Load<RuntimeAnimatorController>(ResourceLibrary.playerAnimators[2]);
        } else
        {
            //GetComponent<SpriteRenderer>().sprite = characterSprites[3];
            ac = Resources.Load<RuntimeAnimatorController>(ResourceLibrary.playerAnimators[3]);
        }
        //animator = GetComponent<Animator>();
        animator.runtimeAnimatorController = ac;
    }

    public PhDStudent[] getListOfStudent()
    {
        Debug.Log((PhDStudent[])phdstudents.ToArray(typeof(PhDStudent)));
        return (PhDStudent[])phdstudents.ToArray(typeof(PhDStudent));
    }

    public void addAPhDStudent(PhDStudent newStudent)
    {
        phdstudents.Add(newStudent);
    }

    public void fireAPhDStudent(PhDStudent student)
    {
        phdstudents.Remove(student);
    }

    public int getNumPhDStudent()
    {
        return phdstudents.Count;
    }

    public void addOneControlDice()
    {
        numControlDice += 1;
    }

    public void loseOneControlDice()
    {
        if (numControlDice > 0)
        {
            numControlDice -= 1;
        }
    }

    public int getNumControlDice()
    {
        return numControlDice;
    }

    public void loseLife(int life2lose)
    {
        Debug.Log("Lose life entered;");
        if (gameObject.CompareTag("Player"))
        {
            updateAnimatorForAgeChange();
        }

        age += life2lose;
        if (age >= maxAge)
        {
            // Game over
        }
    }

    public object[] getUnpublishedFidings()
    {
        return unpublishedFindings.ToArray();
    }

    public void addUnpublishedFinding(int hypid)
    {
        unpublishedFindings.Add(hypid);
    }

    public void removeUnpublishedFindings(int hid)
    {
        unpublishedFindings.Remove(hid);
    }

    public void gainOneNumPublication()
    {
        numPublication += 1;
    }

    public void gainFame(int fame2gain)
    {
        fame += fame2gain;
    }

    public void loseFame(int fame2lose)
    {
        fame -= fame2lose;
    }

    public void gainLife(int life2gain)
    {
        if (gameObject.CompareTag("Player")) {
            updateAnimatorForAgeChange();
        }
       
        age = Mathf.Max(age - life2gain, minAge);
    }

    public void startMoving(int[] dests)
    {
        isMoving = true;
        gameManager.disableDice();
        currDestIdx = 0;
        movingDestSeq = dests;
        animator.SetBool("isWalking", true);
        transform.DOMove(gameManager.getGridPosition(movingDestSeq[currDestIdx]) + characterOffset, grid2gridDuration).SetEase(Ease.InOutQuad).OnComplete(ArriveOnGrid);
    }
	
    void ArriveOnGrid()
    {
        currDestIdx += 1;
        if (currDestIdx <= movingDestSeq.Length - 1)
        {
            transform.DOMove(gameManager.getGridPosition(movingDestSeq[currDestIdx]) + characterOffset, grid2gridDuration).SetEase(Ease.InOutQuad).OnComplete(ArriveOnGrid);
        } else
        {
            animator.SetBool("isWalking", false);
            Debug.Log("Destination grid arrived.");
            gridIdx = movingDestSeq[movingDestSeq.Length - 1];
            movingDestSeq = null;
            //transform.DOShakePosition(0.5f);
            isMoving = false;
            gameManager.executeGrid(gridIdx);
        }
    }
    
    public int getAge()
    {
        return age;
    }

    public int getFame()
    {
        return fame;
    }

    public int getAcedemicSkill()
    {
        return academicSkill;
    }

    public int getNumPublication()
    {
        return numPublication;
    }

	// Update is called once per frame
	void Update () {
        if (gameObject.CompareTag("Player"))
        {
            if (age <= 30)
            {
                GetComponent<SpriteRenderer>().sprite = characterSprites[0];
            }
            else if (age <= 40)
            {
                GetComponent<SpriteRenderer>().sprite = characterSprites[1];
            }
            else if (age <= 60)
            {
                GetComponent<SpriteRenderer>().sprite = characterSprites[2];
            }
            else
            {
                GetComponent<SpriteRenderer>().sprite = characterSprites[3];
            }
        }
        //if(!gameObject.CompareTag("Experiments"))
        //{
        //    transform.Find("Canvas").Find("AgeText").GetComponent<Text>().text = getAge() + " years old";
        //}
    }

}
