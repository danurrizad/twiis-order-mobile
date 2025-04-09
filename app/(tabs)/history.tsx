import { View, ScrollView, Text, Pressable, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal'
import { RadioButton } from 'react-native-paper';
import colors from '../utils/colors';

function HistoryView() {
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState('all')
  const [date, setDate] = useState({
    start: "",
    end: ""
  })

  useEffect(()=>{
    setShowModal(false)
  }, [status])

  return (
    <View style={{ paddingHorizontal: 12, backgroundColor: "white", flex: 1}}>
      <View>
        <Modal 
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
          style={{ justifyContent: 'flex-end', margin: 0 }} // Align modal at the bottom
        >
          <View style={{ height: 400, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingBottom: 10}}>
              <Pressable onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faX}/>
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Filter by status</Text>
            </View>
            <View style={{ borderTopWidth: 1, paddingTop: 10}}>
              <Pressable onPress={() => setStatus('all')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>All status</Text>
                <RadioButton
                  value="all"
                  status={ status === 'all' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('all')}
                  color='#003399'
                  />
              </Pressable>
              <Pressable onPress={() => setStatus('waitApproval')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Waiting Approval</Text>
                <RadioButton
                  value="waitApproval"
                  status={ status === 'waitApproval' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('waitApproval')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('waitConfirmation')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Waiting Confirmation</Text>
                <RadioButton
                  value="waitConfirmation"
                  status={ status === 'waitConfirmation' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('waitConfirmation')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('onProcess')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>On Process</Text>
                <RadioButton
                  value="onProcess"
                  status={ status === 'onProcess' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('onProcess')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('delivery')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Delivery</Text>
                <RadioButton
                  value="delivery"
                  status={ status === 'delivery' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('delivery')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('pickup')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Pickup</Text>
                <RadioButton
                  value="pickup"
                  status={ status === 'pickup' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('pickup')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('completed')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Completed</Text>
                <RadioButton
                  value="completed"
                  status={ status === 'completed' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('completed')}
                  color='#003399'
                />
              </Pressable>
              <Pressable onPress={() => setStatus('rejected')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Rejected</Text>
                <RadioButton
                  value="rejected"
                  status={ status === 'rejected' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('rejected')}
                  color='#003399'
                />
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
          <Pressable style={{ backgroundColor: status==="all" ? "#F2F4F8" : "#003399", padding: 5, width: 170, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}} onPress={()=>setShowModal(!showModal)}>
            <Text style={{ color: status === "all" ? "black" : "white"}}>
              {
                status === "all" ? "All Status" : 
                status === "waitApproval" ? "Waiting Approval" :
                status === "waitConfirmation" ? "Waiting Confirmation" :
                status === "onProcess" ? "On Process" :
                status === "delivery" ? "Delivery" :
                status === "pickup" ? "Pickup" :
                status === "completed" ? "Completed" :
                status === "rejected" ? "Rejected" :
                "All status" 
              }
            </Text>
            <FontAwesomeIcon icon={faChevronDown} color={status === "all" ? "black" : "white"}/>
          </Pressable>
          <Pressable style={{ backgroundColor: "#F2F4F8", padding: 5, width: 170, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}} onPress={()=>setShowModal(!showModal)}>
            <Text style={{ color: "black"}}>All period</Text>
            <FontAwesomeIcon icon={faChevronDown}/>
          </Pressable>
        </View>
      </View>

      <ScrollView>
        <View style={{ marginTop: 20}}>
          <View style={{ borderWidth: 0.5, borderColor: "gray", borderRadius: 5, padding: 10}}>
            <View className='header' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottomColor: 'gray', borderBottomWidth: 0.5}}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Image source={require('../../assets/images/logo/logo-operation.png')} style={{width: 20, height: 20, resizeMode: "center"}}/>
                <View>
                  <Text style={{ fontSize: 12 }}>Operation Supply</Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>6 Januari 2025</Text>
                </View>
              </View>
              <View style={{ backgroundColor: colors.successLight, width: 100, paddingVertical: 3, borderRadius: 5}}>
                <Text style={{ fontSize: 12, color: colors.success, fontWeight: 'bold', textAlign: "center" }}>Completed</Text>
              </View>
            </View>
            <View className='body' style={{ paddingTop: 12, flexDirection: "row", gap: 10}}>
              <View style={{ width: 75, height: 75, borderWidth: 0.5, borderColor: 'gray'}}></View>
              <View style={{ flex: 1}}>
                <Text numberOfLines={2}>KANBAN RING WITH SUPER LONG DESCRIPTION LIKE THIS </Text>
                <Text style={{ fontSize: 12, color: "gray"}}>B073-112831</Text>
              </View>
            </View>
            <View className='footer' style={{ paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <Text style={{ fontWeight: 'bold'}}>Total: Rp 150.500</Text>
              <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 30}}>
                <Text style={{ color: "white"}}>Order again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
    </View>
  );
}

export default HistoryView