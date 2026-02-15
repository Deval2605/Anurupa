#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main(){
    int t,n,i;
    cin >> t;

    while(t--){
    cin >> n;

    vector<int> v(n);

    for(i=0;i<n;i++){
        cin >> v[i];
    }

    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()),v.end());

    int diff = 0-v.at(0);
    int mc=v.at(0);
    for(i=1;i<v.size();i++){
        if(v[i]==v[i-1]+1){
            mc=v[i];
        }
        else{
            break;
        }
    }

    cout << mc+diff+1 << " * \n";
    
    }

    return 0;
       
}
