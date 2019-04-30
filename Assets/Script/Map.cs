using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Map : MonoBehaviour {

    public MapGrid[] grids;

    public static Map instance;

    private void Awake()
    {
        instance = this;
    }

    public MapGrid[] getMapGrids()
    {
        return grids;
    }
}
