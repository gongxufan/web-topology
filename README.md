# web-topology
基于jtopo实现的拓扑编辑器，把项目放tomcat才能访问。具体可参考:https://gongxufan.github.io/2016/12/07/topology-editor/
# update 
增加直线拐点功能,实现思路很简单，在中间增加一个控制点即可，如需要跟多的拐点可以分段增加。
```
js/editor.js
 //鼠标悬浮
    var midList = [];
    this.scene.mouseover(function (e) {
        if(e.target && e.target.midNode){
            e.target.midNode.visible = true;
            return;
        }
        if(e.target && e.target instanceof JTopo.Link && !e.target.hasPaintMid && e.target.lineType == 'line'){
            var nodeA = e.target.nodeA, nodeZ = e.target.nodeZ;
            //移除当前连线
            this.remove(e.target);
            //重建连线
            //中间小节点
            var midNode = new JTopo.CircleNode('');
            midNode.type = 'tag';
            midNode.radius = 3;
            midNode.fillColor = '255,0,0';
            midNode.alpha = 0.7;
            midNode.setLocation((nodeA.cx +nodeZ.cx)/2,(nodeA.cy +nodeZ.cy)/2);
            this.add(midNode)
            var m = new JTopo.Link(nodeA, midNode);
            var n = new JTopo.Link(midNode, nodeZ);
            m.lineType = "line";
            m.strokeColor = self.config.strokeColor;
            m.lineWidth = self.config.lineWidth;
            n.lineType = "line";
            n.strokeColor = self.config.strokeColor;
            n.lineWidth = self.config.lineWidth;
            this.add(m);
            this.add(n);
            m.hasPaintMid = true;
            m.midNode = midNode;
            n.hasPaintMid = true;
            n.midNode = midNode;
            midList.push(midNode);
        }
    });
    this.scene.mouseout(function (e) {
        if(e.target == null || (e.target != null && !e.target instanceof JTopo.Link))
        for (var i = 0; i < midList.length; i++) {
            midList[i].visible = false;
        }
    });
```
# License

License: GNU GPL v3.0
