class Queue:

    def __init__(self):
        self.mData = []
    
    def __len__(self):
        return len(self.mData)
    
    def enqueue(self, item):
        self.data.append(item)

    def dequeue(self):
        self.mData.pop(0)
    
    def front(self):
        return self.data(0)